// Tracks which questions appeared in recent exams and assigns recency-based
// weight multipliers so the generator naturally avoids recent questions
// without hard-excluding them.

const RECENCY_KEY = 'pl300_recency'
const MAX_EXAMS_REMEMBERED = 6

// Weight[i] = multiplier for a question that appeared i exams ago.
// Index 0 = last exam. Questions never seen get weight 1.0.
const RECENCY_WEIGHTS = [0.04, 0.18, 0.38, 0.60, 0.80, 0.92]

// ── Read / write ──────────────────────────────────────────────────────────

function loadRecency() {
  try {
    const raw = localStorage.getItem(RECENCY_KEY)
    // Array of string-ID arrays, newest first
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecency(recency) {
  try {
    localStorage.setItem(RECENCY_KEY, JSON.stringify(recency))
  } catch {}
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Returns a { [questionId]: weight } map for every question in the pool.
 * Weight 1.0 = never seen, approaching 0 = seen very recently.
 */
export function getRepetitionWeights(questions) {
  const recency = loadRecency()
  const weights = {}

  for (const q of questions) {
    const id = String(q.id)
    let weight = 1.0
    for (let i = 0; i < recency.length; i++) {
      if (recency[i].includes(id)) {
        weight = RECENCY_WEIGHTS[i] ?? 1.0
        break
      }
    }
    weights[q.id] = weight
  }

  return weights
}

/**
 * Records the question IDs from a completed exam generation.
 * Prepends a new entry to the recency list and trims to MAX_EXAMS_REMEMBERED.
 */
export function recordExamQuestions(questionIds) {
  const recency = loadRecency()
  const updated = [questionIds.map(String), ...recency].slice(0, MAX_EXAMS_REMEMBERED)
  saveRecency(updated)
}

/**
 * Returns a map of { [questionId]: examsAgo } for questions seen recently.
 * Useful for displaying "freshness" stats.
 */
export function getExposureStats() {
  const recency = loadRecency()
  const stats = {}
  for (let i = 0; i < recency.length; i++) {
    for (const id of recency[i]) {
      if (!(id in stats)) stats[id] = i + 1 // 1-indexed: "1 exam ago"
    }
  }
  return stats
}

/**
 * How many unique questions have appeared across remembered exams.
 */
export function getSeenCount() {
  const recency = loadRecency()
  const all = new Set(recency.flat())
  return all.size
}

export function clearRepetitionData() {
  localStorage.removeItem(RECENCY_KEY)
}
