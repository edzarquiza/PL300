const KEY = 'pl300_retry_queue'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

function save(queue) {
  localStorage.setItem(KEY, JSON.stringify(queue))
}

// Normalize all IDs to strings so numeric and string references match.
const norm = id => String(id)

export function getRetryQueue() {
  return load()
}

export function addToRetryQueue(questionId) {
  const id = norm(questionId)
  const q = load()
  if (!q.includes(id)) { q.push(id); save(q) }
}

export function removeFromRetryQueue(questionId) {
  const id = norm(questionId)
  save(load().filter(x => x !== id))
}

export function isInRetryQueue(questionId) {
  return load().includes(norm(questionId))
}

export function clearRetryQueue() {
  localStorage.removeItem(KEY)
}
