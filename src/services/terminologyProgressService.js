const STORAGE_KEY = 'pl300_term_progress'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { weak: {}, views: {} }
    const parsed = JSON.parse(raw)
    return {
      weak:  parsed.weak  ?? {},
      views: parsed.views ?? {},
    }
  } catch {
    return { weak: {}, views: {} }
  }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function getWeakTermIds() {
  return Object.keys(load().weak)
}

export function markTermWeak(termId) {
  const data = load()
  data.weak[termId] = true
  save(data)
}

export function markTermKnown(termId) {
  const data = load()
  delete data.weak[termId]
  save(data)
}

export function isTermWeak(termId) {
  return !!load().weak[termId]
}

export function recordTermView(termId) {
  const data = load()
  data.views[termId] = (data.views[termId] ?? 0) + 1
  save(data)
}

export function getTermViewCount(termId) {
  return load().views[termId] ?? 0
}

export function getTotalWeakCount() {
  return Object.keys(load().weak).length
}
