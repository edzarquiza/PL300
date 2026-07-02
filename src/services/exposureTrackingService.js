// Lifetime per-question exposure tracking.
// Persists across sessions so "unseen first" logic works long-term.
//
// Data shape: { [questionId]: { seenCount, lastSeenMs, correctCount, incorrectCount } }

const EXPOSURE_KEY = 'pl300_exposure'
const PREF_KEY     = 'pl300_prioritize_unseen'

// ── Storage helpers ───────────────────────────────────────────────────────

function load() {
  try { return JSON.parse(localStorage.getItem(EXPOSURE_KEY) ?? '{}') } catch { return {} }
}
function save(data) {
  try { localStorage.setItem(EXPOSURE_KEY, JSON.stringify(data)) } catch {}
}

// ── "Prioritize Unseen" preference ────────────────────────────────────────

export function getPrioritizeUnseen() {
  try { return localStorage.getItem(PREF_KEY) !== 'false' } catch { return true }
}
export function setPrioritizeUnseen(value) {
  try { localStorage.setItem(PREF_KEY, String(value)) } catch {}
}

// ── Write ─────────────────────────────────────────────────────────────────

// Called from examGenerator after question selection — marks questions as "seen".
export function recordQuestionsExposed(questionIds) {
  const data = load()
  const now  = Date.now()
  for (const id of questionIds) {
    const key = String(id)
    if (!data[key]) data[key] = { seenCount: 0, lastSeenMs: 0, correctCount: 0, incorrectCount: 0 }
    data[key].seenCount++
    data[key].lastSeenMs = now
  }
  save(data)
}

// Called from ResultsPage after exam submission — records correct / incorrect per question.
export function recordExamAnswers(questions, answers) {
  if (!questions?.length) return
  const data = load()
  for (const q of questions) {
    const answer = answers?.[q.id]
    if (answer === undefined || answer === null) continue
    const key = String(q.id)
    if (!data[key]) data[key] = { seenCount: 1, lastSeenMs: Date.now(), correctCount: 0, incorrectCount: 0 }
    if (isCorrect(q, answer)) data[key].correctCount++
    else                       data[key].incorrectCount++
  }
  save(data)
}

// ── Read ──────────────────────────────────────────────────────────────────

export function getExposureData() { return load() }

// Exposure score for weighted sampling.
//   2.0 → never seen (highest priority)
//   ~1.0 → seen long ago or frequently wrong
//   0.1 → seen recently and answered correctly (lowest priority)
export function getExposureScore(questionId, exposureData) {
  const exp = exposureData?.[String(questionId)]
  if (!exp || exp.seenCount === 0) return 2.0

  const total      = exp.correctCount + exp.incorrectCount
  const accuracy   = total > 0 ? exp.correctCount / total : 0.5
  const daysSince  = (Date.now() - exp.lastSeenMs) / 86_400_000
  const ageFactor  = Math.min(1.0, daysSince / 14)   // 0 → 1 over two weeks
  const weakFactor = 1.0 - accuracy                   // 1.0 if always wrong

  return 0.1 + ageFactor * 0.6 + weakFactor * 0.8
}

// Filter questions the user has never encountered.
export function getUnseenQuestions(questions) {
  const data = load()
  return questions.filter(q => {
    const exp = data[String(q.id)]
    return !exp || exp.seenCount === 0
  })
}

// Coverage statistics for an arbitrary question pool.
export function getPoolCoverage(questions) {
  if (!questions?.length) return { total: 0, seen: 0, unseen: 0, pct: 0 }
  const data = load()
  const seen = questions.filter(q => {
    const exp = data[String(q.id)]
    return exp && exp.seenCount > 0
  }).length
  return {
    total:  questions.length,
    seen,
    unseen: questions.length - seen,
    pct:    Math.round(seen / questions.length * 100),
  }
}

// Per-track pool (without triplication — just domain + exclusive-tag filtering).
// For source-filtered tracks, pass the source pool directly via msQuestions param.
export function getTrackPool(allQuestions, track, msQuestions) {
  if (track.sourceFilter === 'microsoft_practice' && msQuestions) {
    return msQuestions
  }

  const domains = Object.keys(track.domainWeights)
  let pool = allQuestions.filter(q => domains.includes(q.domain))
  if (track.tagFilter && track.tagExclusive) {
    pool = pool.filter(q => q.tags?.some(t => track.tagFilter.includes(t)))
  }
  if (track.typeFilter?.length > 0) {
    pool = pool.filter(q => track.typeFilter.includes(q.type))
  }
  return pool
}

export function clearExposureData() {
  localStorage.removeItem(EXPOSURE_KEY)
}

// ── Internal ──────────────────────────────────────────────────────────────

function isCorrect(q, answer) {
  if (answer === undefined || answer === null) return false
  if (q.type === 'multi') {
    if (!Array.isArray(answer) || answer.length === 0) return false
    const sa = [...answer].sort((a, b) => a - b)
    const sc = [...q.correctAnswers].sort((a, b) => a - b)
    return JSON.stringify(sa) === JSON.stringify(sc)
  }
  return q.correctAnswers.includes(answer)
}
