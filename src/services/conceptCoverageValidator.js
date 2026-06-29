// Concept Coverage Validator
// Compares Microsoft Practice Assessment questions against the full simulator bank
// to detect concept gaps and generate improvement recommendations.

import { extractConcepts } from './conceptExposureService'
import { CONCEPT_FAMILIES, getFamilyForQuestion } from './conceptFamilyEngine'

export function validateConceptCoverage(microsoftQuestions, simulatorQuestions) {
  const msConcepts = new Map()
  const simConcepts = new Map()

  for (const q of microsoftQuestions) {
    const text = [q.question, ...(q.choices || []), q.explanation || ''].join(' ')
    for (const c of extractConcepts(text)) {
      if (!msConcepts.has(c)) msConcepts.set(c, [])
      msConcepts.get(c).push(q.id)
    }
  }

  for (const q of simulatorQuestions) {
    const text = [q.question, ...(q.choices || []), q.explanation || ''].join(' ')
    for (const c of extractConcepts(text)) {
      if (!simConcepts.has(c)) simConcepts.set(c, [])
      simConcepts.get(c).push(q.id)
    }
  }

  const report = []

  for (const [concept, msIds] of msConcepts) {
    const simIds = simConcepts.get(concept) || []
    report.push({
      concept,
      msQuestionCount: msIds.length,
      simQuestionCount: simIds.length,
      coverage: simIds.length > 0 ? 'Complete' : 'Missing',
      msQuestionIds: msIds,
      simQuestionIds: simIds,
    })
  }

  report.sort((a, b) => {
    if (a.coverage === 'Missing' && b.coverage !== 'Missing') return -1
    if (a.coverage !== 'Missing' && b.coverage === 'Missing') return 1
    return b.msQuestionCount - a.msQuestionCount
  })

  const complete = report.filter(r => r.coverage === 'Complete')
  const missing = report.filter(r => r.coverage === 'Missing')

  return {
    totalConcepts: report.length,
    completeConcepts: complete.length,
    missingConcepts: missing.length,
    coveragePct: report.length > 0
      ? Math.round(complete.length / report.length * 100)
      : 100,
    report,
    missing,
    complete,
  }
}

export function getConceptFamilyCoverage(microsoftQuestions) {
  const familyCounts = {}

  for (const q of microsoftQuestions) {
    const family = getFamilyForQuestion(q)
    if (family) {
      familyCounts[family] = (familyCounts[family] || 0) + 1
    }
  }

  return Object.entries(CONCEPT_FAMILIES).map(([name, data]) => ({
    family: name,
    description: data.description,
    questionCount: familyCounts[name] || 0,
    concepts: data.concepts,
    relatedFamilies: data.relatedFamilies,
  })).sort((a, b) => b.questionCount - a.questionCount)
}

export function generateGapReport(microsoftQuestions, simulatorQuestions) {
  const coverage = validateConceptCoverage(microsoftQuestions, simulatorQuestions)
  const familyCoverage = getConceptFamilyCoverage(microsoftQuestions)

  const recommendations = coverage.missing.map(m => ({
    concept: m.concept,
    priority: m.msQuestionCount >= 3 ? 'High' : m.msQuestionCount >= 2 ? 'Medium' : 'Low',
    action: `Create ${Math.max(1, m.msQuestionCount)} question(s) where ${m.concept} is tested`,
    msQuestionCount: m.msQuestionCount,
  }))

  return {
    coverage,
    familyCoverage,
    recommendations: recommendations.sort((a, b) => {
      const prio = { High: 3, Medium: 2, Low: 1 }
      return (prio[b.priority] || 0) - (prio[a.priority] || 0)
    }),
  }
}
