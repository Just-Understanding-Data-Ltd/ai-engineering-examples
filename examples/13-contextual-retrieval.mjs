// Contextual retrieval: before embedding a chunk, prepend a short line saying
// where it sits in the document. An ambiguous chunk ("it rose 3%") becomes
// retrievable because the embedding now carries the missing subject.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/contextual-retrieval/
import { embed, embedMany, cosineSimilarity, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const emb = openai.embedding('text-embedding-3-small')
const doc =
  'Acme Corp Q3 report. Revenue was $4.2m for the quarter. It climbed 3% on the prior period. Costs fell.'
// The target chunk is opaque on its own: "it climbed 3%" names no subject, so a raw
// embedding cannot tell it is about revenue. The decoy chunk owns the word "revenue".
const chunks = ['Revenue was $4.2m for the quarter.', 'It climbed 3% on the prior period.', 'Costs fell.']
const target = 1 // the chunk that actually answers the query
const query = 'What was the percentage revenue growth?'

// Naive: embed each chunk exactly as written.
const { embeddings: naive } = await embedMany({ model: emb, values: chunks })

// Contextual: ask the model to situate each chunk in the document, then embed
// the situating line together with the chunk.
const situated = []
for (const c of chunks) {
  const { text } = await generateText({
    model: openai('gpt-5-mini'),
    prompt: `Document: ${doc}\nChunk: "${c}"\nWrite one short sentence of context for where this chunk sits. Context only, no preamble.`,
  })
  situated.push(`${text.trim()} ${c}`)
}
const { embeddings: ctx } = await embedMany({ model: emb, values: situated })

const { embedding: q } = await embed({ model: emb, value: query })
const ranked = (vecs) =>
  chunks
    .map((text, i) => ({ i, text, score: cosineSimilarity(q, vecs[i]) }))
    .sort((a, b) => b.score - a.score)
const scoreOf = (vecs) => cosineSimilarity(q, vecs[target]).toFixed(3)

console.log('naive top:       ', ranked(naive)[0].text, `(growth chunk scored ${scoreOf(naive)})`)
console.log('contextual top:  ', ranked(ctx)[0].text, `(growth chunk scored ${scoreOf(ctx)})`)
// Situating the chunk raises the growth line's similarity to the query, because its
// embedding now carries the subject "revenue" that the raw chunk was missing. On a
// toy corpus the rank may not move, but that score lift is what pulls an opaque but
// relevant chunk above the fold once real distractors are in the index.
