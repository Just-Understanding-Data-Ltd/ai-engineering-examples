// An agent is a model given tools and run in a loop. Pass `tools` and a stop
// condition and the SDK runs the loop: the model calls a tool, reads the result,
// and answers.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/agents-vs-workflows/
import { generateText, tool, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const getWeather = tool({
  description: 'Get the current weather for a city',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => ({ city, tempC: 21 }),
})

const { text, steps } = await generateText({
  model: openai('gpt-5-mini'),
  tools: { getWeather },
  stopWhen: stepCountIs(5),
  prompt: 'What is the weather in Lisbon? Use the tool, then answer in one sentence.',
})

console.log('steps:', steps.length)
console.log('answer:', text.trim())
