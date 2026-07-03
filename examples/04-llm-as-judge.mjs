// LLM-as-judge: score another model's output against a rubric. Force a
// structured verdict so you get a clean number, not prose to parse.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/llm-as-judge/
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const { object } = await generateObject({
  model: openai('gpt-5-mini'),
  schema: z.object({
    score: z.number().min(0).max(1),
    reason: z.string(),
  }),
  prompt: 'Rate how well "Paris" answers "capital of France?". Return a score 0-1 and a short reason.',
})

console.log('verdict:', object)
