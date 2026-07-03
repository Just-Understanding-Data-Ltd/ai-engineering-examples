// Chunking splits a long document into smaller, retrievable pieces. Size and
// overlap decide what can be found as a unit. No API call needed.
// Dictionary: https://understandingdata.com/context-engineering-dictionary/chunking/

function chunk(text, size = 5, overlap = 1) {
  const words = text.split(/\s+/).filter(Boolean)
  const out = []
  for (let i = 0; i < words.length; i += size - overlap) {
    out.push(words.slice(i, i + size).join(' '))
  }
  return out
}

const chunks = chunk('one two three four five six seven eight nine ten', 5, 1)
console.log('chunks:', chunks)
// Real chunkers split on sentence or paragraph boundaries so each piece holds a
// complete thought. Overlap keeps a fact from being cut across a boundary.
