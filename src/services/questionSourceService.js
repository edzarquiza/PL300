// Reusable Question Source System
// Supports: Microsoft Practice Assessment, Custom Simulator, future sources (MeasureUp, Community, etc.)

import allSimulatorQuestions from '../data/questions.json'
import microsoftQuestions from '../data/microsoftPracticeAssessment.json'

export const QUESTION_SOURCES = [
  {
    id: 'custom_simulator',
    name: 'Custom Simulator',
    description: 'Original simulator question bank',
    color: 'blue',
    icon: 'PL',
  },
  {
    id: 'microsoft_practice',
    name: 'Microsoft Practice Assessment',
    description: 'Official Microsoft PL-300 practice assessment questions',
    color: 'amber',
    icon: 'MS',
    isOfficial: true,
  },
]

const SOURCE_QUESTION_MAP = {
  custom_simulator: allSimulatorQuestions,
  microsoft_practice: microsoftQuestions,
}

export function getQuestionsBySource(sourceId) {
  return SOURCE_QUESTION_MAP[sourceId] ?? []
}

export function getAllSourceQuestions() {
  return [
    ...allSimulatorQuestions,
    ...microsoftQuestions,
  ]
}

export function getSourceForQuestion(question) {
  if (question.source === 'Microsoft Practice Assessment') return 'microsoft_practice'
  return 'custom_simulator'
}

export function getSourceById(sourceId) {
  return QUESTION_SOURCES.find(s => s.id === sourceId) ?? QUESTION_SOURCES[0]
}

export function getQuestionPool(selectedSources) {
  if (!selectedSources || selectedSources.length === 0) {
    return allSimulatorQuestions
  }
  if (selectedSources.includes('all')) {
    return getAllSourceQuestions()
  }
  const pool = []
  for (const src of selectedSources) {
    pool.push(...(SOURCE_QUESTION_MAP[src] ?? []))
  }
  return pool
}

export function getSourceStats() {
  return QUESTION_SOURCES.map(src => ({
    ...src,
    questionCount: (SOURCE_QUESTION_MAP[src.id] ?? []).length,
  }))
}
