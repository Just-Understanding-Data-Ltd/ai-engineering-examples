// Routing: classify the input into a fixed set of options, then dispatch to the
// handler built for it. An enum keeps the classifier from inventing routes.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/routing/
import { generateText, generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const model = openai('gpt-5-mini')
const query = 'How do I reset my password?'

const { object } = await generateObject({
  model,
  schema: z.object({ route: z.enum(['billing', 'technical', 'general']) }),
  prompt: 'Classify this support query into billing, technical, or general: ' + query,
})

const answer = await generateText({
  model,
  prompt: 'You are the ' + object.route + ' specialist. Answer in one sentence: ' + query,
})

console.log('route:', object.route)
console.log('answer:', answer.text.trim())
