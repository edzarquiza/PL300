import { shuffleArray } from '../utils/arrayUtils'
import { getTrackById } from '../data/examTracks'
import { selectVariants, recordSeenQuestions, renderScenario } from './variantEngine'

export function generateExamFromTrack(allQuestions, {
  questionCount = 10,
  trackId = 'full_pl300',
  domains = [],
  difficulties = [],
} = {}) {
  const track = getTrackById(trackId)

  let pool = [...allQuestions]

  // Domain filtering: track defines scope unless user overrides with explicit domains
  const trackDomains = Object.keys(track.domainWeights)
  const activeDomains = domains.length > 0 ? domains : trackDomains
  const allFourDomains = activeDomains.length === 4
  if (!allFourDomains || trackId !== 'full_pl300') {
    pool = pool.filter(q => activeDomains.includes(q.domain))
  }

  // Difficulty filter
  if (difficulties.length > 0) {
    pool = pool.filter(q => difficulties.includes(q.difficulty))
  }

  // Tag priority for intensive tracks: 3:1 bias toward tagged questions
  if (track.tagFilter?.length > 0) {
    const tagged = pool.filter(q => q.tags?.some(t => track.tagFilter.includes(t)))
    const untagged = pool.filter(q => !q.tags?.some(t => track.tagFilter.includes(t)))
    pool = [...tagged, ...tagged, ...tagged, ...untagged]
  }

  if (pool.length === 0) return []

  // Variant deduplication + smart rotation: pick best (unseen) variant per concept group
  const deduped = selectVariants(pool)

  // Weighted domain selection
  const cap = Math.min(questionCount, deduped.length)
  const selected = weightedSelect(deduped, track.domainWeights, cap)

  // Fill scenario template variables where present
  const rendered = selected.map(renderScenario)

  // Record which questions were served for future rotation
  recordSeenQuestions(rendered.map(q => q.id))

  return shuffleArray(rendered)
}

function weightedSelect(questions, domainWeights, target) {
  const byDomain = {}
  for (const q of questions) {
    if (!byDomain[q.domain]) byDomain[q.domain] = []
    byDomain[q.domain].push(q)
  }

  const presentDomains = Object.keys(byDomain)

  // Single-domain track: just return shuffled slice
  if (presentDomains.length === 1) {
    return shuffleArray(byDomain[presentDomains[0]]).slice(0, target)
  }

  const totalWeight = presentDomains.reduce((s, d) => s + (domainWeights[d] ?? 0), 0)

  // Floor-allocate per domain
  const allocated = {}
  let totalAllocated = 0
  for (const d of presentDomains) {
    const share = totalWeight > 0 ? (domainWeights[d] ?? 0) / totalWeight : 1 / presentDomains.length
    allocated[d] = Math.min(Math.floor(target * share), byDomain[d].length)
    totalAllocated += allocated[d]
  }

  // Distribute remainder to domains with spare capacity
  let remaining = target - totalAllocated
  for (const d of shuffleArray([...presentDomains])) {
    if (remaining <= 0) break
    const spare = byDomain[d].length - allocated[d]
    const add = Math.min(remaining, spare)
    if (add > 0) { allocated[d] += add; remaining -= add }
  }

  const result = []
  for (const [d, count] of Object.entries(allocated)) {
    result.push(...shuffleArray(byDomain[d]).slice(0, count))
  }
  return result
}
