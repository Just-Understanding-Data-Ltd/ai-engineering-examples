// Hybrid search runs lexical (BM25) and semantic (vector) retrieval side by side,
// then fuses the two rankings with Reciprocal Rank Fusion. Exact-keyword matches
// and meaning matches cover each other's blind spots.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/hybrid-search/
import { embed, embedMany, cosineSimilarity } from 'ai'
import { openai } from '@ai-sdk/openai'

const emb = openai.embedding('text-embedding-3-small')
const docs = [
  'The K8s pod kept dying with an OOMKilled status.', // jargon: only semantics links it to the query
  'Our servers ran out of memory during the traffic spike.', // shares the word "memory"
  'The invoice was paid in full on the first of the month.', // irrelevant
  'Raise the container memory limit to stop the restarts.', // shares "memory"
]
// A paraphrase whose only shared word is "memory", and that word never appears in
// doc 0, so BM25 is blind to the OOMKilled doc. Only meaning can reach it.
const query = 'the process was killed for using too much memory'

// --- Lexical: a tiny in-file BM25 (no dependencies) ---
// Drop stopwords first, otherwise a rare filler word like "was" gets a high idf
// on a tiny corpus and hijacks the ranking. Real lexical search does the same.
const STOP = new Set('a an the was were is are for of on in to too my and with it its using much'.split(' '))
const tokenize = (s) => (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => !STOP.has(t))
const corpus = docs.map(tokenize)
const avgLen = corpus.reduce((n, d) => n + d.length, 0) / corpus.length
const df = {}
for (const d of corpus) for (const t of new Set(d)) df[t] = (df[t] ?? 0) + 1
const idf = (t) => Math.log(1 + (corpus.length - (df[t] ?? 0) + 0.5) / ((df[t] ?? 0) + 0.5))
const bm25 = (qs, d, k = 1.5, b = 0.75) =>
  qs.reduce((s, t) => {
    const tf = d.filter((w) => w === t).length
    return tf ? s + idf(t) * ((tf * (k + 1)) / (tf + k * (1 - b + (b * d.length) / avgLen))) : s
  }, 0)

const qs = tokenize(query)
const lexical = corpus.map((d, i) => ({ i, score: bm25(qs, d) })).sort((a, b) => b.score - a.score)

// --- Semantic: embeddings + cosine ---
const { embeddings } = await embedMany({ model: emb, values: docs })
const { embedding: q } = await embed({ model: emb, value: query })
const semantic = docs
  .map((_, i) => ({ i, score: cosineSimilarity(q, embeddings[i]) }))
  .sort((a, b) => b.score - a.score)

// --- Fuse with Reciprocal Rank Fusion ---
const rrf = (rank, k = 60) => 1 / (k + rank)
const fused = docs
  .map((_, i) => ({
    i,
    score: rrf(lexical.findIndex((x) => x.i === i)) + rrf(semantic.findIndex((x) => x.i === i)),
  }))
  .sort((a, b) => b.score - a.score)

console.log('lexical top: ', docs[lexical[0].i]) // can only match on the word "memory"
console.log('semantic top:', docs[semantic[0].i]) // ranks by meaning, so OOMKilled can surface
console.log('hybrid top:  ', docs[fused[0].i]) // fusion reconciles the two rankings
console.log('hybrid #2:   ', docs[fused[1].i]) // the other method's winner rides up too
