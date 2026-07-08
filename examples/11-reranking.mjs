// Reranking: a cheap vector search over-fetches a shortlist, then a stronger
// model reorders it. The first pass optimises for recall, the second for
// precision. Two stages beat one because each is good at a different job.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/reranking/
import { embed, embedMany, cosineSimilarity, generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const emb = openai.embedding('text-embedding-3-small')
const docs = [
  // A near-restatement of the query: high embedding similarity, zero real answer.
  'We know that buying something and then wanting your money back can be frustrating.',
  'Our refund window is 30 days from the delivery date.',
  'The warehouse ships orders within two business days.',
  'To return an item, email support and we issue the refund within a week.',
  'Standard delivery takes three to five business days.',
]
const query = 'How do I get my money back after buying something?'

// Pass 1: retrieve a shortlist by embedding similarity (fast, high recall).
const { embeddings } = await embedMany({ model: emb, values: docs })
const { embedding: q } = await embed({ model: emb, value: query })
const shortlist = docs
  .map((text, i) => ({ text, vec: cosineSimilarity(q, embeddings[i]) }))
  .sort((a, b) => b.vec - a.vec)
  .slice(0, 3)

// Pass 2: rerank the shortlist with a model that reads query and doc together.
const reranked = []
for (const cand of shortlist) {
  const { object } = await generateObject({
    model: openai('gpt-5-mini'),
    schema: z.object({ relevance: z.number().min(0).max(1) }),
    prompt: `Query: ${query}\nDocument: ${cand.text}\nScore how well the document answers the query, 0 to 1.`,
  })
  reranked.push({ ...cand, rerank: object.relevance })
}
reranked.sort((a, b) => b.rerank - a.rerank)

console.log('vector top-1:  ', shortlist[0].text)
console.log('reranked top-1:', reranked[0].text)
console.table(
  reranked.map((r) => ({ vec: r.vec.toFixed(3), rerank: r.rerank.toFixed(2), text: r.text })),
)
