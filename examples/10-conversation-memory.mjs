// Conversation history: a model keeps no memory between calls, so you re-send
// the running message list to make it "remember" earlier turns.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/conversation-history/
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const model = openai('gpt-5-mini')
const messages = [{ role: 'user', content: 'My name is James. Remember it.' }]

const first = await generateText({ model, messages })
messages.push({ role: 'assistant', content: first.text })
messages.push({ role: 'user', content: 'What is my name?' })

const second = await generateText({ model, messages })
console.log('recall:', second.text.trim())
