// Prompt chaining: a fixed sequence of steps where each step's output feeds the
// next. Two small, focused calls beat one sprawling instruction.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/prompt-chaining/
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const model = openai('gpt-5-mini')

const outline = await generateText({
  model,
  prompt: 'Give a 3-bullet outline for a short note about RAG.',
})

const draft = await generateText({
  model,
  prompt: 'Write one tight paragraph from this outline: ' + outline.text,
})

console.log('outline:\n' + outline.text.trim())
console.log('\ndraft:\n' + draft.text.trim())
