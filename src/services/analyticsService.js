const HIGH_CONFIDENCE = new Set(['confident', 'very_confident'])
const LOW_CONFIDENCE = new Set(['very_unsure', 'unsure'])

export function getConfidenceAnalytics(questions, answers, confidence) {
  let correctHighConfidence = 0
  let correctLowConfidence = 0
  let correctNeutral = 0
  let incorrectHighConfidence = 0
  let incorrectLowConfidence = 0
  let incorrectNeutral = 0
  let unrated = 0

  for (const q of questions) {
    const answer = answers[q.id]
    const level = confidence[q.id]
    const answered = answer !== undefined && answer !== null &&
      (!Array.isArray(answer) || answer.length > 0)
    if (!answered) continue

    const correct = isAnswerCorrect(q, answer)
    if (!level) { unrated++; continue }

    if (correct) {
      if (HIGH_CONFIDENCE.has(level)) correctHighConfidence++
      else if (LOW_CONFIDENCE.has(level)) correctLowConfidence++
      else correctNeutral++
    } else {
      if (HIGH_CONFIDENCE.has(level)) incorrectHighConfidence++
      else if (LOW_CONFIDENCE.has(level)) incorrectLowConfidence++
      else incorrectNeutral++
    }
  }

  return {
    correctHighConfidence,
    correctLowConfidence,
    correctNeutral,
    incorrectHighConfidence,
    incorrectLowConfidence,
    incorrectNeutral,
    unrated,
  }
}

export function getSubtopicAnalytics(questions, answers, confidence) {
  const map = {}

  for (const q of questions) {
    const answer = answers[q.id]
    const answered = answer !== undefined && answer !== null &&
      (!Array.isArray(answer) || answer.length > 0)
    if (!answered) continue

    const key = q.subtopic || 'Unknown'
    if (!map[key]) map[key] = { subtopic: key, correct: 0, total: 0, lowConfidenceCorrect: 0 }

    const correct = isAnswerCorrect(q, answer)
    const level = confidence[q.id]
    map[key].total++
    if (correct) {
      map[key].correct++
      if (LOW_CONFIDENCE.has(level)) map[key].lowConfidenceCorrect++
    }
  }

  return Object.values(map)
    .map(s => {
      const rawPct = Math.round(s.correct / s.total * 100)
      const adjustedScore = Math.round((s.correct - s.lowConfidenceCorrect * 0.5) / s.total * 100)
      return { ...s, rawPct, adjustedScore }
    })
    .sort((a, b) => a.adjustedScore - b.adjustedScore)
}

export function getTrapAnalytics(questions, answers, confidence) {
  const map = {}

  for (const q of questions) {
    if (!q.trapType) continue
    const answer = answers[q.id]
    const answered = answer !== undefined && answer !== null &&
      (!Array.isArray(answer) || answer.length > 0)
    if (!answered) continue
    if (isAnswerCorrect(q, answer)) continue

    const key = q.trapType
    if (!map[key]) map[key] = { trapType: key, count: 0, highConfidenceCount: 0, examples: [] }
    map[key].count++
    const level = confidence[q.id]
    if (HIGH_CONFIDENCE.has(level)) map[key].highConfidenceCount++
    if (map[key].examples.length < 2) map[key].examples.push(q.commonTrap || q.question.slice(0, 60))
  }

  return Object.values(map)
    .sort((a, b) => (b.highConfidenceCount * 2 + b.count) - (a.highConfidenceCount * 2 + a.count))
}

export function getTimingAnalytics(questions, questionTimes) {
  const timed = questions.filter(q => questionTimes[q.id] > 0)
  if (!timed.length) return null

  const totalSeconds = timed.reduce((sum, q) => sum + questionTimes[q.id], 0)
  const avgSeconds = Math.round(totalSeconds / timed.length)
  const overTimeCount = timed.filter(q => questionTimes[q.id] > (q.estimatedTimeSeconds || 90)).length

  const domainMap = {}
  const subtopicMap = {}

  for (const q of timed) {
    const t = questionTimes[q.id]
    const d = q.domain || 'Unknown'
    const s = q.subtopic || 'Unknown'
    if (!domainMap[d]) domainMap[d] = { domain: d, total: 0, count: 0 }
    if (!subtopicMap[s]) subtopicMap[s] = { subtopic: s, total: 0, count: 0 }
    domainMap[d].total += t
    domainMap[d].count++
    subtopicMap[s].total += t
    subtopicMap[s].count++
  }

  const domainTiming = Object.values(domainMap)
    .map(d => ({ ...d, avg: Math.round(d.total / d.count) }))
    .sort((a, b) => b.avg - a.avg)

  const subtopicTiming = Object.values(subtopicMap)
    .map(s => ({ ...s, avg: Math.round(s.total / s.count) }))
    .sort((a, b) => b.avg - a.avg)

  const slowestQuestions = [...timed]
    .sort((a, b) => questionTimes[b.id] - questionTimes[a.id])
    .slice(0, 3)
    .map(q => ({ id: q.id, question: q.question.slice(0, 80), seconds: questionTimes[q.id], estimated: q.estimatedTimeSeconds || 90 }))

  return {
    avgSeconds,
    totalSeconds,
    timedCount: timed.length,
    overTimeCount,
    domainTiming,
    subtopicTiming,
    slowestQuestions,
    slowestDomain: domainTiming[0]?.domain || null,
    slowestSubtopic: subtopicTiming[0]?.subtopic || null,
  }
}

export function getCognitiveLevelAnalytics(questions, answers) {
  const map = {}

  for (const q of questions) {
    if (!q.cognitiveLevel) continue
    const answer = answers[q.id]
    const answered = answer !== undefined && answer !== null &&
      (!Array.isArray(answer) || answer.length > 0)
    if (!answered) continue

    const key = q.cognitiveLevel
    if (!map[key]) map[key] = { level: key, correct: 0, total: 0 }
    map[key].total++
    if (isAnswerCorrect(q, answer)) map[key].correct++
  }

  const order = ['recall', 'understanding', 'application', 'analysis']
  return Object.values(map)
    .map(l => ({ ...l, pct: Math.round(l.correct / l.total * 100) }))
    .sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level))
}

function isAnswerCorrect(question, answer) {
  if (question.type === 'multiple') {
    if (!Array.isArray(answer)) return false
    const a = [...answer].sort((x, y) => x - y)
    const b = [...question.correctAnswers].sort((x, y) => x - y)
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
  return answer === question.correctAnswers[0]
}
