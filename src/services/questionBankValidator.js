import allQuestions from '../data/questions.json'
import { getConceptExposure } from './conceptExposureService'

const DOMAIN_TARGETS = {
  'Prepare the data':          { min: 0.25, max: 0.30 },
  'Model the data':            { min: 0.25, max: 0.30 },
  'Visualize and analyze data': { min: 0.25, max: 0.30 },
  'Manage and secure Power BI': { min: 0.15, max: 0.20 },
}

export function validateQuestionBank(questions = allQuestions) {
  const exposure = getConceptExposure(questions)
  const warnings = []

  // ── Concept balance checks ─────────────────────────────────────────────────
  for (const [concept, stats] of Object.entries(exposure)) {
    const total = stats.correct + stats.distractor
    if (total < 2) continue
    const distractorRatio = stats.distractor / total

    if (stats.correct === 0 && stats.distractor >= 2) {
      warnings.push({
        type: 'NEVER_CORRECT',
        concept,
        correct: stats.correct,
        distractor: stats.distractor,
        severity: 'high',
        message: `"${concept}" appears ${stats.distractor}× as a distractor but never as the correct answer.`,
        recommendation: `Add questions where "${concept}" is the right choice in a valid scenario.`,
      })
    } else if (distractorRatio >= 0.80 && stats.distractor >= 3) {
      warnings.push({
        type: 'DISTRACTOR_HEAVY',
        concept,
        correct: stats.correct,
        distractor: stats.distractor,
        severity: distractorRatio >= 0.90 ? 'high' : 'medium',
        message: `"${concept}" appears ${stats.distractor}× as distractor vs ${stats.correct}× as correct (${Math.round(distractorRatio * 100)}% distractor rate).`,
        recommendation: `Add questions where "${concept}" is specifically the correct answer.`,
      })
    }
  }

  // ── Domain distribution check ──────────────────────────────────────────────
  const total = questions.length
  const domainCounts = {}
  questions.forEach(q => {
    domainCounts[q.domain] = (domainCounts[q.domain] || 0) + 1
  })

  for (const [domain, target] of Object.entries(DOMAIN_TARGETS)) {
    const count = domainCounts[domain] || 0
    const pct = count / total
    if (pct < target.min) {
      warnings.push({
        type: 'DOMAIN_UNDERREPRESENTED',
        concept: domain,
        severity: pct < target.min - 0.05 ? 'high' : 'medium',
        message: `Domain "${domain}" is ${Math.round(pct * 100)}% of the bank (target: ${Math.round(target.min * 100)}–${Math.round(target.max * 100)}%).`,
        recommendation: `Add ${Math.ceil((target.min - pct) * total)} more questions for this domain.`,
      })
    }
  }

  // ── Difficulty check ───────────────────────────────────────────────────────
  const diffCounts = {}
  questions.forEach(q => {
    diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1
  })
  if ((diffCounts['Hard'] || 0) / total < 0.15) {
    warnings.push({
      type: 'DIFFICULTY_SKEW',
      concept: 'Hard difficulty',
      severity: 'low',
      message: `Only ${Math.round(((diffCounts['Hard'] || 0) / total) * 100)}% Hard questions (target: ≥15%).`,
      recommendation: 'Add more Hard questions — PL-300 tests analysis and reasoning, not only recall.',
    })
  }

  return {
    warnings,
    exposure,
    domainCounts,
    diffCounts,
    totalQuestions: total,
    summary: {
      neverCorrect: warnings.filter(w => w.type === 'NEVER_CORRECT').length,
      distractorHeavy: warnings.filter(w => w.type === 'DISTRACTOR_HEAVY').length,
      domainIssues: warnings.filter(w => w.type === 'DOMAIN_UNDERREPRESENTED').length,
    },
  }
}

export function getBankHealth(questions = allQuestions) {
  const { warnings, summary, totalQuestions } = validateQuestionBank(questions)
  const highCount = warnings.filter(w => w.severity === 'high').length
  const medCount  = warnings.filter(w => w.severity === 'medium').length

  let status = 'good'
  if (highCount > 0) status = 'critical'
  else if (medCount > 2) status = 'needs_attention'

  return { status, highCount, medCount, totalQuestions, summary, warnings }
}
