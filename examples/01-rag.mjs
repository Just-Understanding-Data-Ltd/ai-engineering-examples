// Retrieval-augmented generation: embed a corpus, retrieve the closest chunk to
// the query by cosine similarity, then answer grounded in it.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/retrieval-augmented-generation/
import { embed, embedMany, cosineSimilarity, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const emb = openai.embedding('text-embedding-3-small')
const docs = [
  'James Phoenix runs Understanding Data.',
  'Paris is the capital of France.',
]
const { embeddings } = await embedMany({ model: emb, values: docs })

const { embedding } = await embed({ model: emb, value: 'Who runs Understanding Data?' })
const ranked = docs
  .map((text, i) => ({ text, score: cosineSimilarity(embedding, embeddings[i]) }))
  .sort((a, b) => b.score - a.score)

const { text } = await generateText({
  model: openai('gpt-5-mini'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Answer the question using only this context:' },
        { type: 'text', text: ranked[0].text },
        { type: 'text', text: 'Question: Who runs Understanding Data?' },
      ],
    },
  ],
})

console.log('retrieved:', ranked[0].text, `(score ${ranked[0].score.toFixed(3)})`)
console.log('answer:', text.trim())
