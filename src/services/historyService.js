const HISTORY_KEY = 'pl300_history'
const MAX_ENTRIES = 20

export function saveExamResult(result) {
  const history = getExamHistory()
  const { score, domainBreakdown, subtopicBreakdown, mode, timeSpent, questionCount, confidence, questionTimes, trapStats, trackId, examSeed, questionIds, answers, questionResults } = result
  history.unshift({ score, domainBreakdown, subtopicBreakdown, mode, timeSpent, questionCount, confidence, questionTimes, trapStats, trackId, examSeed: examSeed ?? null, questionIds: questionIds ?? [], answers: answers ?? {}, questionResults: questionResults ?? {}, savedAt: Date.now() })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)))
}

export function getExamHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function getWeakDomains(history) {
  if (!history.length) return []

  const domainTotals = {}
  const domainCounts = {}

  for (const entry of history) {
    if (!entry.domainBreakdown) continue
    for (const { domain, percentage } of entry.domainBreakdown) {
      domainTotals[domain] = (domainTotals[domain] ?? 0) + percentage
      domainCounts[domain] = (domainCounts[domain] ?? 0) + 1
    }
  }

  return Object.entries(domainTotals)
    .map(([domain, total]) => ({ domain, avgPct: Math.round(total / domainCounts[domain]) }))
    .filter(({ avgPct }) => avgPct < 70)
    .sort((a, b) => a.avgPct - b.avgPct)
    .map(({ domain }) => domain)
}
