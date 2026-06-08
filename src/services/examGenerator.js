// Comprehensive exam generator that replaces the basic trackGenerator flow.
//
// Design:
//   1. Build domain-filtered, variant-deduplicated pool
//   2. Score each question: anti-repetition weight × weak-area boost
//   3. Allocate slots by domain (honouring official PL-300 weighting)
//   4. Within each domain, allocate slots by difficulty target
//   5. Fill each slot via weighted random sampling (seeded if seed given)
//   6. Record results for future anti-repetition

import { selectVariants, renderScenario, recordSeenQuestions } from './variantEngine'
import { getRepetitionWeights, recordExamQuestions } from './antiRepetitionEngine'
import { getExamHistory } from './historyService'
import { getSubtopicMastery } from './masteryService'
import { getTrackById } from '../data/examTracks'
import { getCaseStudyQuestions } from './caseStudyEngine'
import { getExposureData, getExposureScore, getUnseenQuestions, recordQuestionsExposed } from './exposureTrackingService'

// ── Official PL-300 domain weighting ─────────────────────────────────────
const DOMAIN_IDEAL = {
  'Prepare the data':           0.28,
  'Model the data':             0.28,
  'Visualize and analyze data': 0.28,
  'Manage and secure Power BI': 0.16,
}

// Soft difficulty targets for balanced exams (ignored when difficulty filter active)
const DIFFICULTY_IDEAL = {
  Easy:   0.25,
  Medium: 0.50,
  Hard:   0.25,
}

// ── Seeded PRNG (Mulberry32) ──────────────────────────────────────────────

function fnv32(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let s = typeof seed === 'string' ? fnv32(seed) : (seed >>> 0) || 1
  return function () {
    s += 0x6d2b79f5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle(arr, rng) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export { mulberry32, seededShuffle }

// Shuffle the choices of a single question deterministically using the exam seed.
// Remaps correctAnswers and choiceExplanations to match the new order.
export function shuffleQuestionChoices(q, seed) {
  if (!q.choices || q.choices.length <= 1) return q
  const rng = mulberry32(`${seed ?? 'default'}-choices-${q.id}`)
  // shuffledOldIndices[newPos] = oldPos
  const origIndices = Array.from({ length: q.choices.length }, (_, i) => i)
  const shuffledOldIndices = seededShuffle(origIndices, rng)
  const oldToNew = {}
  shuffledOldIndices.forEach((oldIdx, newIdx) => { oldToNew[oldIdx] = newIdx })

  const result = {
    ...q,
    choices: shuffledOldIndices.map(old => q.choices[old]),
    correctAnswers: q.correctAnswers.map(old => oldToNew[old]),
  }

  if (q.choiceExplanations) {
    if (Array.isArray(q.choiceExplanations)) {
      result.choiceExplanations = shuffledOldIndices.map(old => q.choiceExplanations[old])
    } else {
      const newExpl = {}
      for (const [k, v] of Object.entries(q.choiceExplanations)) {
        const old = parseInt(k)
        if (!isNaN(old) && oldToNew[old] !== undefined) newExpl[oldToNew[old]] = v
      }
      result.choiceExplanations = newExpl
    }
  }

  return result
}

export function generateSeed() {
  return `PL300-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
}

export function parseSeed(raw) {
  if (!raw || typeof raw !== 'string') return null
  const clean = raw.trim().toUpperCase()
  if (/^PL300-\d{4}$/.test(clean)) return clean
  if (/^\d{4}$/.test(clean)) return `PL300-${clean}`
  return null
}

// ── Weak-area score boost ─────────────────────────────────────────────────

function buildWeakBoosts(questions) {
  const history = getExamHistory()
  if (!history.length) return {}

  const mastery = getSubtopicMastery(history)
  const weak = new Set(mastery.filter(m => m.pct < 65).map(m => m.subtopic))

  const boosts = {}
  for (const q of questions) {
    if (weak.has(q.subtopic)) boosts[q.id] = 0.6  // +60% score
  }
  return boosts
}

// ── Weighted random sampling without replacement ──────────────────────────

function weightedSample(pool, n, scoreFn, rng) {
  if (n <= 0 || pool.length === 0) return []
  if (n >= pool.length) return seededShuffle(pool, rng)

  const result = []
  const rem = [...pool]

  for (let i = 0; i < n && rem.length > 0; i++) {
    // Build CDF
    const scores = rem.map(q => Math.max(0.01, scoreFn(q)))
    const total  = scores.reduce((s, x) => s + x, 0)

    let rand = rng() * total
    let pick = rem.length - 1
    for (let j = 0; j < rem.length; j++) {
      rand -= scores[j]
      if (rand <= 0) { pick = j; break }
    }

    result.push(rem[pick])
    rem.splice(pick, 1)
  }

  return result
}

// ── Slot allocation ───────────────────────────────────────────────────────

function allocateDomainSlots(domains, idealWeights, target, byDomain, rng) {
  const totalW = domains.reduce((s, d) => s + (idealWeights[d] ?? 0), 0) || 1
  const slots  = {}
  let allocated = 0

  // Floor pass
  for (const d of domains) {
    const share = (idealWeights[d] ?? 0) / totalW
    slots[d]   = Math.min(Math.floor(target * share), byDomain[d].length)
    allocated  += slots[d]
  }

  // Distribute remainder, highest-weight domain first
  let rem = target - allocated
  const sorted = [...domains].sort(
    (a, b) => (idealWeights[b] ?? 0) - (idealWeights[a] ?? 0)
  )
  for (const d of sorted) {
    if (rem <= 0) break
    const spare = byDomain[d].length - slots[d]
    if (spare > 0) { const add = Math.min(rem, spare); slots[d] += add; rem -= add }
  }

  return slots
}

function allocateDifficultySlots(questions, totalSlots) {
  const byDiff = { Easy: [], Medium: [], Hard: [] }
  for (const q of questions) {
    if (byDiff[q.difficulty]) byDiff[q.difficulty].push(q)
  }

  const slots  = {}
  let allocated = 0
  for (const [diff, ideal] of Object.entries(DIFFICULTY_IDEAL)) {
    slots[diff] = Math.min(Math.floor(totalSlots * ideal), byDiff[diff].length)
    allocated  += slots[diff]
  }

  // Fill remainder in Medium → Easy → Hard order
  let rem = totalSlots - allocated
  for (const diff of ['Medium', 'Easy', 'Hard']) {
    if (rem <= 0) break
    const spare = byDiff[diff].length - slots[diff]
    if (spare > 0) { const add = Math.min(rem, spare); slots[diff] += add; rem -= add }
  }

  return { slots, byDiff }
}

// ── Main generator ────────────────────────────────────────────────────────

/**
 * @param {object[]} allQuestions - full question bank
 * @param {object}   options
 *   questionCount  {number}   - how many questions (default 40)
 *   trackId        {string}   - which exam track (default 'full_pl300')
 *   domains        {string[]} - domain override (empty = track defaults)
 *   difficulties   {string[]} - difficulty filter (empty = all)
 *   examMode       {string}   - 'exam' | 'study' | 'weak_area'
 *   seed           {string|null} - deterministic seed (e.g. "PL300-4832")
 *   weakAreaBoost  {boolean}  - boost weak subtopics in selection
 * @returns {object[]} shuffled question array
 */
export function generateExam(allQuestions, {
  questionCount    = 40,
  trackId          = 'full_pl300',
  domains          = [],
  difficulties     = [],
  examMode         = 'exam',
  seed             = null,
  weakAreaBoost    = false,
  prioritizeUnseen = true,
} = {}) {
  const rng   = seed ? mulberry32(seed) : mulberry32(Math.random() * 0xffffffff)
  const track = getTrackById(trackId)

  // ── 1. Build pool ───────────────────────────────────────────────────────
  const trackDomains  = Object.keys(track.domainWeights)
  const activeDomains = domains.length > 0 ? domains : trackDomains
  const singleDomain  = activeDomains.length === 1

  // Merge case study questions into the pool
  const csQuestions = getCaseStudyQuestions()
  let pool = [...allQuestions, ...csQuestions]

  // Domain scope
  if (!singleDomain || domains.length > 0) {
    pool = pool.filter(q => activeDomains.includes(q.domain))
  } else if (trackId !== 'full_pl300') {
    pool = pool.filter(q => activeDomains.includes(q.domain))
  }

  // Difficulty scope
  if (difficulties.length > 0) {
    pool = pool.filter(q => difficulties.includes(q.difficulty))
  }

  // Tag affinity for intensive tracks: triplicate tagged questions
  if (track.tagFilter?.length > 0) {
    const tagged   = pool.filter(q => q.tags?.some(t => track.tagFilter.includes(t)))
    if (track.tagExclusive) {
      // Exclusive tracks: only questions that match at least one tag
      pool = [...tagged, ...tagged, ...tagged]
    } else {
      const untagged = pool.filter(q => !q.tags?.some(t => track.tagFilter.includes(t)))
      pool = [...tagged, ...tagged, ...tagged, ...untagged]
    }
  }

  if (pool.length === 0) return []

  // ── 2. Variant deduplication (prefer unseen variants per concept group) ─
  const deduped = selectVariants(pool)

  // ── 3. Score every candidate question ───────────────────────────────────
  const repWeights   = getRepetitionWeights(deduped)
  const exposureData = getExposureData()
  const weakBoosts   = (weakAreaBoost || examMode === 'weak_area')
    ? buildWeakBoosts(deduped)
    : {}

  function scoreQ(q) {
    const rep      = repWeights[q.id] ?? 1.0
    const weak     = weakBoosts[q.id] ?? 0
    const exposure = getExposureScore(q.id, exposureData)
    // exposure:  2.0 = never seen, 0.1 = recently seen + correct
    // rep:       recency weight from recent exam sessions
    // Combined: exposure dominates to ensure unseen questions surface first
    return exposure * rep * (1 + weak)
  }

  // ── 4. Unseen-first partitioning ─────────────────────────────────────────
  // When prioritizeUnseen is on and enough unseen questions exist, draw
  // exclusively from the unseen pool. Otherwise fill unseen first then top
  // up from the seen pool (weighted by exposure score).
  const cap = Math.min(questionCount, deduped.length)

  let candidatePool = deduped
  if (prioritizeUnseen) {
    const unseen = getUnseenQuestions(deduped)
    if (unseen.length >= cap) {
      // Full exam from unseen — no repetition at all
      candidatePool = unseen
    } else if (unseen.length > 0) {
      // Use all unseen + fill from seen (lowest exposure score = highest weight)
      const seenPool = deduped.filter(q => !unseen.includes(q))
      candidatePool = [...unseen, ...seenPool]
      // unseen questions already have score 2.0 so they naturally win sampling
    }
  }
  let selected

  if (activeDomains.length <= 1) {
    // Single-domain track: use difficulty balance only
    if (difficulties.length === 0) {
      const { slots, byDiff } = allocateDifficultySlots(candidatePool, cap)
      selected = []
      for (const [diff, count] of Object.entries(slots)) {
        selected.push(...weightedSample(byDiff[diff], count, scoreQ, rng))
      }
    } else {
      selected = weightedSample(candidatePool, cap, scoreQ, rng)
    }
  } else {
    // Multi-domain: allocate by domain first, then difficulty within each
    const byDomain = {}
    for (const q of candidatePool) {
      if (!byDomain[q.domain]) byDomain[q.domain] = []
      byDomain[q.domain].push(q)
    }

    const presentDomains = Object.keys(byDomain)
    const idealWeights   = track.domainWeights
    const domainSlots    = allocateDomainSlots(presentDomains, idealWeights, cap, byDomain, rng)

    selected = []
    for (const [domain, slots] of Object.entries(domainSlots)) {
      if (slots === 0) continue
      const dq = byDomain[domain]
      if (difficulties.length > 0) {
        // Difficulty locked by user filter — just score-sample
        selected.push(...weightedSample(dq, slots, scoreQ, rng))
      } else {
        // Apply soft difficulty distribution within this domain
        const { slots: dSlots, byDiff } = allocateDifficultySlots(dq, slots)
        for (const [diff, cnt] of Object.entries(dSlots)) {
          selected.push(...weightedSample(byDiff[diff], cnt, scoreQ, rng))
        }
      }
    }
  }

  // ── 5. Render scenario variables, shuffle choices, then shuffle order ───
  const rendered = selected.map(q => shuffleQuestionChoices(renderScenario(q), seed ?? 'default'))
  const shuffled = seededShuffle(rendered, rng)

  // ── 6. Record for future anti-repetition and lifetime exposure ───────────
  const ids = shuffled.map(q => q.id)
  recordSeenQuestions(ids)
  recordExamQuestions(ids)
  recordQuestionsExposed(ids)

  return shuffled
}
