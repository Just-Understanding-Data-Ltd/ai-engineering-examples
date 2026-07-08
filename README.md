# AI Engineering Examples

Small, runnable [Vercel AI SDK](https://ai-sdk.dev/) examples for the core patterns of **AI engineering**: getting the right information in front of a model at the right time, wiring up agents and tools, verifying output, and doing it all without leaking data. Every example in here is executed against a live model before it ships, so what you read is what actually runs.

Companion to the [Context Engineering Dictionary](https://understandingdata.com/context-engineering-dictionary/), the [AI Coding Dictionary](https://understandingdata.com/ai-coding-dictionary/), and the field guides on [context engineering](https://understandingdata.com/context-engineering/) and [AI-native software engineering](https://understandingdata.com/ai-native-software-engineering/) at understandingdata.com.

## Run it

```bash
npm install
export OPENAI_API_KEY=sk-...        # examples use gpt-5-mini + text-embedding-3-small
npm run rag                          # or any script below
```

Requires Node 18+. Each example is a single self-contained file under `examples/`.

## Core patterns

| Script | Pattern | Definition |
| --- | --- | --- |
| `npm run rag` | Retrieval-augmented generation | [RAG](https://understandingdata.com/context-engineering-dictionary/retrieval-augmented-generation/) |
| `npm run agent` | Agent = tools + a loop | [Agents vs. workflows](https://understandingdata.com/context-engineering-dictionary/agents-vs-workflows/) |
| `npm run self-consistency` | Sample N, take the majority | [Self-consistency](https://understandingdata.com/context-engineering-dictionary/self-consistency/) |
| `npm run llm-as-judge` | Score output against a rubric | [LLM-as-judge](https://understandingdata.com/context-engineering-dictionary/llm-as-judge/) |
| `npm run structured-output` | Validated objects, not prose | [Structured output](https://understandingdata.com/context-engineering-dictionary/structured-output/) |
| `npm run embeddings` | Meaning as geometry | [Embeddings](https://understandingdata.com/context-engineering-dictionary/embeddings/) |
| `npm run chunking` | Split before you retrieve | [Chunking](https://understandingdata.com/context-engineering-dictionary/chunking/) |
| `npm run prompt-chaining` | Output of one step feeds the next | [Prompt chaining](https://understandingdata.com/context-engineering-dictionary/prompt-chaining/) |
| `npm run routing` | Classify, then dispatch | [Routing](https://understandingdata.com/context-engineering-dictionary/routing/) |
| `npm run memory` | Re-send history to remember | [Conversation history](https://understandingdata.com/context-engineering-dictionary/conversation-history/) |

## Retrieval

| Script | Pattern | Definition |
| --- | --- | --- |
| `npm run reranking` | Over-fetch cheap, reorder with a stronger model | [Reranking](https://understandingdata.com/context-engineering-dictionary/reranking/) |
| `npm run hybrid-search` | BM25 + vectors, fused with RRF | [Hybrid search](https://understandingdata.com/context-engineering-dictionary/hybrid-search/) |
| `npm run contextual-retrieval` | Situate a chunk before embedding it | [Contextual retrieval](https://understandingdata.com/context-engineering-dictionary/contextual-retrieval/) |

## Security

| Script | Pattern | Definition |
| --- | --- | --- |
| `npm run prompt-injection` | Untrusted text hijacks the task, and how to fence it | [Prompt injection](https://understandingdata.com/context-engineering-dictionary/prompt-injection/) |
| `npm run lethal-trifecta` | Private data + untrusted content + egress = theft | [The lethal trifecta](https://understandingdata.com/context-engineering-dictionary/lethal-trifecta/) |
| `npm run mcp-tool-poisoning` | A tool description that carries hidden instructions | [MCP tool poisoning](https://understandingdata.com/ai-coding-dictionary/mcp-tool-poisoning/) |

## Notes

- Examples default to `gpt-5-mini` and `text-embedding-3-small` to keep runs cheap. Swap in any [AI SDK provider](https://ai-sdk.dev/providers/ai-sdk-providers) by changing the import and model id.
- The security examples simulate egress and exfiltration in-process. They never make a real network call to an attacker, they just show where the leak would happen and how to cut it.
- The point is legibility, not production hardening. Read them, run them, and lift the pattern you need.

## License

MIT, by [James Phoenix](https://understandingdata.com) / Just Understanding Data Ltd.
