// Derives concept-level mastery from exposure data + the concept keyword map.
// Groups questions by concept, then cross-references with exposure tracking.

import { CONCEPTS, extractConcepts } from './conceptExposureService'
import { getExposureData } from './exposureTrackingService'

// Build a concept → question[] map using question text, correct-answer text, tags, and explanation.
function buildConceptMap(allQuestions) {
  const map = {}
  for (const concept of Object.keys(CONCEPTS)) map[concept] = []

  for (const q of allQuestions) {
    // Combine all searchable text for this question
    const text = [
      q.question,
      ...(q.choices ?? []),
      q.explanation ?? '',
      (q.tags ?? []).join(' '),
    ].join(' ')

    const concepts = extractConcepts(text)
    for (const c of concepts) {
      if (!map[c].some(x => x.id === q.id)) map[c].push(q)
    }
  }

  return map
}

// Returns an array sorted by mastery % ascending (weakest first).
// Each entry: { concept, total, seen, correct, masteryPct, coveragePct }
export function getConceptCoverage(allQuestions) {
  const conceptMap  = buildConceptMap(allQuestions)
  const exposureData = getExposureData()
  const result = []

  for (const [concept, questions] of Object.entries(conceptMap)) {
    if (questions.length === 0) continue

    let seen    = 0
    let correct = 0

    for (const q of questions) {
      const exp = exposureData[String(q.id)]
      if (!exp || exp.seenCount === 0) continue
      seen++
      if (exp.correctCount > exp.incorrectCount) correct++
    }

    result.push({
      concept,
      total:       questions.length,
      seen,
      correct,
      coveragePct: Math.round(seen / questions.length * 100),
      masteryPct:  seen > 0 ? Math.round(correct / seen * 100) : null,
    })
  }

  // Sort: unseen/weak first, then by mastery ascending
  return result
    .filter(r => r.total >= 2)
    .sort((a, b) => {
      // Null masteryPct (never seen) sorts first
      if (a.masteryPct === null && b.masteryPct === null) return a.coveragePct - b.coveragePct
      if (a.masteryPct === null) return -1
      if (b.masteryPct === null) return 1
      return a.masteryPct - b.masteryPct
    })
}

// Top n weakest concepts (for home-page summary).
export function getTopWeakConcepts(allQuestions, n = 6) {
  return getConceptCoverage(allQuestions).slice(0, n)
}
