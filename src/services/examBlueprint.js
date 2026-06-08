import { shuffleArray } from '../utils/arrayUtils'

export const EXAM_DOMAINS = [
  'Prepare the data',
  'Model the data',
  'Visualize and analyze the data',
  'Manage and secure Power BI',
]

const DOMAIN_WEIGHTS = {
  'Prepare the data': 0.2881,
  'Model the data': 0.2881,
  'Visualize and analyze the data': 0.2881,
  'Manage and secure Power BI': 0.1356,
}

export function generateExam(allQuestions, { questionCount, domains = [], difficulties = [] }) {
  let pool = allQuestions
  if (domains.length > 0) pool = pool.filter(q => domains.includes(q.domain))
  if (difficulties.length > 0) pool = pool.filter(q => difficulties.includes(q.difficulty))

  if (pool.length === 0) return []
  if (questionCount >= pool.length) return shuffleArray(pool)

  const activeDomains = domains.length > 0 ? domains : EXAM_DOMAINS
  const domainPools = {}
  for (const d of activeDomains) {
    domainPools[d] = shuffleArray(pool.filter(q => q.domain === d))
  }

  const totalWeight = activeDomains.reduce((s, d) => s + (DOMAIN_WEIGHTS[d] ?? 0), 0)
  const selected = []

  for (const d of activeDomains) {
    const weight = (DOMAIN_WEIGHTS[d] ?? 0) / totalWeight
    const count = Math.round(questionCount * weight)
    selected.push(...domainPools[d].slice(0, Math.min(count, domainPools[d].length)))
  }

  // Fill remaining slots if rounding left gaps
  const used = new Set(selected.map(q => q.id))
  const remaining = shuffleArray(pool.filter(q => !used.has(q.id)))
  let i = 0
  while (selected.length < questionCount && i < remaining.length) {
    selected.push(remaining[i++])
  }

  return shuffleArray(selected.slice(0, questionCount))
}
