// Aggregates subtopic and trap performance across all saved exam history.

export function getSubtopicMastery(history) {
  if (!history.length) return []

  const map = {}

  for (const entry of history) {
    if (!entry.subtopicBreakdown) continue
    for (const { subtopic, correct, total } of entry.subtopicBreakdown) {
      if (!map[subtopic]) map[subtopic] = { subtopic, correct: 0, total: 0, snapshots: [] }
      map[subtopic].correct += correct
      map[subtopic].total += total
      map[subtopic].snapshots.push(Math.round(correct / total * 100))
    }
  }

  return Object.values(map)
    .filter(s => s.total > 0)
    .map(s => ({
      subtopic: s.subtopic,
      correct: s.correct,
      total: s.total,
      pct: Math.round(s.correct / s.total * 100),
      trend: computeTrend(s.snapshots),
    }))
    .sort((a, b) => a.pct - b.pct)
}

export function getConceptTrapHistory(history) {
  if (!history.length) return []

  const map = {}

  for (const entry of history) {
    if (!entry.trapStats) continue
    for (const { trapType, count, highConfidenceCount } of entry.trapStats) {
      if (!map[trapType]) map[trapType] = { trapType, count: 0, highConfidenceCount: 0, sessions: 0 }
      map[trapType].count += count
      map[trapType].highConfidenceCount += highConfidenceCount
      map[trapType].sessions++
    }
  }

  return Object.values(map)
    .sort((a, b) => (b.highConfidenceCount * 2 + b.count) - (a.highConfidenceCount * 2 + a.count))
}

function computeTrend(snapshots) {
  if (snapshots.length < 3) return 'neutral'
  const recent = avg(snapshots.slice(-2))
  const earlier = avg(snapshots.slice(0, -2))
  if (recent > earlier + 10) return 'improving'
  if (recent < earlier - 10) return 'declining'
  return 'neutral'
}

function avg(arr) {
  return arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0
}
