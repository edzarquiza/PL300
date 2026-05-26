import { isAnswerCorrect } from '../utils/answerUtils'

/**
 * Analyses answer-change behaviour and exam stamina from a completed session.
 *
 * @param {object[]} questions  - ordered question array (exam sequence)
 * @param {object}   answers    - { [questionId]: answer }
 * @param {object}   answerChanges - { [questionId]: changeCount }
 * @returns {object} psychology analytics payload
 */
export function getPsychologyAnalytics(questions, answers, answerChanges = {}) {
  if (!questions?.length) return null

  // ── Change counts ─────────────────────────────────────────────────────────
  const totalChanges = Object.values(answerChanges).reduce((s, n) => s + n, 0)

  // Questions where the user changed the answer and the final answer is wrong
  const changedToWrong = questions.filter(q => {
    const changes = answerChanges[q.id] ?? 0
    if (changes === 0) return false
    return !isAnswerCorrect(answers[q.id], q)
  }).length

  // Questions where the user changed the answer and the final answer is correct
  const changedToRight = questions.filter(q => {
    const changes = answerChanges[q.id] ?? 0
    if (changes === 0) return false
    return isAnswerCorrect(answers[q.id], q)
  }).length

  // Most-changed questions (hesitation hot spots)
  const mostChanged = Object.entries(answerChanges)
    .filter(([, n]) => n >= 2)
    .map(([id, n]) => {
      const q = questions.find(q => String(q.id) === String(id))
      return q ? { id, changes: n, subtopic: q.subtopic, question: q.question } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.changes - a.changes)
    .slice(0, 5)

  // ── Stamina (first half vs second half accuracy) ──────────────────────────
  const half = Math.floor(questions.length / 2)
  const firstHalf  = questions.slice(0, half)
  const secondHalf = questions.slice(half)

  function pct(qs) {
    if (!qs.length) return null
    const correct = qs.filter(q => isAnswerCorrect(answers[q.id], q)).length
    return Math.round((correct / qs.length) * 100)
  }

  const firstHalfPct  = pct(firstHalf)
  const secondHalfPct = pct(secondHalf)
  const staminaDrop   = (firstHalfPct !== null && secondHalfPct !== null)
    ? firstHalfPct - secondHalfPct
    : 0

  return {
    totalChanges,
    changedToWrong,
    changedToRight,
    mostChanged,
    stamina: {
      firstHalfPct,
      secondHalfPct,
      drop: staminaDrop,
      hasIssue: staminaDrop >= 10,
    },
  }
}
