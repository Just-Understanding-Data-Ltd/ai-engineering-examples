// Embeddings turn text into vectors whose closeness tracks closeness in meaning.
// Same idea, different words scores high; a different idea scores low.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/embeddings/
import { embed, cosineSimilarity } from 'ai'
import { openai } from '@ai-sdk/openai'

const model = openai.embedding('text-embedding-3-small')
const a = await embed({ model, value: 'cats are great pets' })
const b = await embed({ model, value: 'feline companions' })
const c = await embed({ model, value: 'quarterly tax filing' })

console.log('dimensions:', a.embedding.length)
console.log('sim(cats, feline):', cosineSimilarity(a.embedding, b.embedding).toFixed(3))
console.log('sim(cats, tax):   ', cosineSimilarity(a.embedding, c.embedding).toFixed(3))
