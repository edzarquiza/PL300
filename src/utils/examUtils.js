import { isAnswerEmpty, isAnswerCorrect as checkCorrect } from './answerUtils'

function isAnswerCorrect(userAnswer, question) {
  return checkCorrect(userAnswer, question)
}

export function calculateScore(questions, answers) {
  let correct = 0
  let unanswered = 0

  questions.forEach(q => {
    const userAnswer = answers[q.id]
    if (isAnswerEmpty(userAnswer, q)) {
      unanswered++
    } else if (isAnswerCorrect(userAnswer, q)) {
      correct++
    }
  })

  const total = questions.length
  const incorrect = total - correct - unanswered
  const percentage = Math.round((correct / total) * 100)
  const passed = percentage >= 70

  return { correct, incorrect, unanswered, total, percentage, passed }
}

export function getDomainBreakdown(questions, answers) {
  const map = {}

  questions.forEach(q => {
    const key = q.domain
    if (!map[key]) map[key] = { correct: 0, total: 0 }
    map[key].total++
    if (isAnswerCorrect(answers[q.id], q)) map[key].correct++
  })

  return Object.entries(map)
    .map(([domain, { correct, total }]) => ({
      domain,
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage)
}

// Only valid for single/multiple question types; guarded at call sites for other types.
export function computeNewAnswer(question, currentAnswer, choiceIndex) {
  if (question.type === 'multi') {
    const current = Array.isArray(currentAnswer) ? currentAnswer : []
    return current.includes(choiceIndex)
      ? current.filter(i => i !== choiceIndex).sort((a, b) => a - b)
      : [...current, choiceIndex].sort((a, b) => a - b)
  }
  return choiceIndex
}

export function getSubtopicBreakdown(questions, answers) {
  const map = {}

  questions.forEach(q => {
    const key = q.subtopic || 'Unknown'
    if (!map[key]) map[key] = { correct: 0, total: 0 }
    map[key].total++
    if (isAnswerCorrect(answers[q.id], q)) map[key].correct++
  })

  return Object.entries(map)
    .map(([subtopic, { correct, total }]) => ({
      subtopic,
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage)
}

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
