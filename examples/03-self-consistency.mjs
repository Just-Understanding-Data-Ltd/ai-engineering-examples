// Self-consistency: sample the same prompt N times and take the majority answer.
// Trades a few extra (parallel) calls for a big drop in variance.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/self-consistency/
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const model = openai('gpt-5-mini')
const runs = await Promise.all(
  Array.from({ length: 5 }, () =>
    generateText({ model, prompt: 'Is 17 prime? Answer only yes or no.' })
  )
)

const tally = {}
for (const r of runs) {
  const a = r.text.trim().toLowerCase().replace(/[^a-z]/g, '')
  tally[a] = (tally[a] || 0) + 1
}
const answer = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]

console.log('votes:', tally)
console.log('majority answer:', answer)
