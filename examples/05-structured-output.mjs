// Structured output: give the model a schema and get back a validated object,
// not free text you have to regex. The SDK handles the JSON contract.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/llm-as-judge/
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const { object } = await generateObject({
  model: openai('gpt-5-mini'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
  }),
  prompt: 'Classify the sentiment of: "I absolutely love this product".',
})

console.log('classification:', object)
