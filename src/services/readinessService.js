// Readiness Prediction Engine
// Synthesises exam history, domain balance, trap frequency, confidence calibration,
// coverage breadth, and score trend into a single 0-100 readiness estimate.

import { getExamHistory } from './historyService'
import { getSubtopicMastery, getConceptTrapHistory } from './masteryService'
import { getExposureData } from './exposureTrackingService'

const RISK_THRESHOLD   = 65   // domain avg below this → risk area
const STRONG_THRESHOLD = 80   // domain avg above this → strong area

// Weight scheme: most recent exam counts most
const RECENCY_WEIGHTS = [0.5, 0.3, 0.2]

// ── Helpers ──────────────────────────────────────────────────────────────────

function avgDomainScores(recent) {
  const map   = {}
  const count = {}
  for (const entry of recent) {
    if (!entry.domainBreakdown) continue
    for (const { domain, percentage } of entry.domainBreakdown) {
      map[domain]   = (map[domain]   ?? 0) + percentage
      count[domain] = (count[domain] ?? 0) + 1
    }
  }
  return Object.entries(map).map(([domain, total]) => ({
    domain,
    avg: Math.round(total / count[domain]),
  }))
}

function weightedAvgScore(recent) {
  let score = 0
  let weight = 0
  for (let i = 0; i < recent.length; i++) {
    const w = RECENCY_WEIGHTS[i] ?? 0.1
    score  += (recent[i].score.percentage / 100) * w
    weight += w
  }
  return weight > 0 ? score / weight : 0
}

function scoreTrend(history) {
  // Compare avg of last 2 vs avg of entries 3-5
  if (history.length < 3) return 'stable'
  const recent  = (history[0].score.percentage + history[1].score.percentage) / 2 / 100
  const older   = history.slice(2, 5).reduce((s, e) => s + e.score.percentage, 0) / Math.min(3, history.slice(2, 5).length) / 100
  if (recent > older + 0.08) return 'improving'
  if (recent < older - 0.08) return 'declining'
  return 'stable'
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Computes a 0-100 PL-300 readiness estimate.
 *
 * Point allocation:
 *   Base (weighted recent avg)     0-40
 *   Domain balance (penalty)       0 to -15
 *   Trap penalty                   0 to -15
 *   Confidence calibration (bonus) 0-10
 *   Trend bonus/penalty            -10 to +10
 *   Coverage bonus                 0-10
 *   Participation floor            +5
 *
 * @param {object[]} allQuestions - full question bank (for coverage calc)
 * @returns readiness object or null if no history
 */
export function computeReadiness(allQuestions) {
  const history = getExamHistory()

  if (!history.length) return null

  const recent       = history.slice(0, 3)
  const avgScore     = weightedAvgScore(recent)         // 0-1
  const basePoints   = Math.round(avgScore * 40)        // 0-40

  // Domain balance penalty: -5 pts per domain below threshold, max -15
  const domainAvgs   = avgDomainScores(recent)
  const weakDomains  = domainAvgs.filter(d => d.avg < RISK_THRESHOLD)
  const domainPenalty = Math.min(15, weakDomains.length * 5)

  // Trap penalty: -3 pts per trap seen across 2+ sessions, max -15
  const trapHistory   = getConceptTrapHistory(history)
  const repeatedTraps = trapHistory.filter(t => t.sessions >= 2)
  const trapPenalty   = Math.min(15, repeatedTraps.length * 3)

  // Confidence calibration bonus (0-10)
  // Approach: measure false-confidence incidents from saved trapStats
  // (incorrect + high confidence count from analyticsService)
  let falseConfidenceCount = 0
  let answeredCount = 0
  for (const entry of recent) {
    if (!entry.confidence) continue
    const ca = entry.confidence
    falseConfidenceCount += (ca.incorrectHighConfidence ?? 0)
    answeredCount += (
      (ca.correctHighConfidence ?? 0) +
      (ca.correctLowConfidence ?? 0) +
      (ca.correctNeutral ?? 0) +
      (ca.incorrectHighConfidence ?? 0) +
      (ca.incorrectLowConfidence ?? 0) +
      (ca.incorrectNeutral ?? 0)
    )
  }
  const falseConfidenceRatio = answeredCount > 0 ? falseConfidenceCount / answeredCount : 0
  const calibrationBonus = Math.round((1 - Math.min(1, falseConfidenceRatio * 5)) * 10)  // 0-10

  // Score trend
  const trend = scoreTrend(history)
  const trendBonus = trend === 'improving' ? 10 : trend === 'declining' ? -10 : 0

  // Coverage bonus (0-10): % of question bank exposed
  const exposureData = getExposureData()
  const seenCount    = Object.values(exposureData).filter(e => e.seenCount > 0).length
  const coveragePct  = allQuestions.length > 0 ? seenCount / allQuestions.length : 0
  const coverageBonus = Math.round(coveragePct * 10)

  const rawScore = basePoints - domainPenalty - trapPenalty + calibrationBonus + trendBonus + coverageBonus + 5
  const score    = Math.max(2, Math.min(100, rawScore))

  // ── Interpretation ──────────────────────────────────────────────────────────
  const strongAreas = domainAvgs.filter(d => d.avg >= STRONG_THRESHOLD).map(d => d.domain)
  const riskAreas   = [
    ...weakDomains.map(d => `${d.domain} (${d.avg}%)`),
    ...repeatedTraps.slice(0, 3).map(t => t.trapType),
  ].slice(0, 5)

  let label, recommendation
  if (score >= 85) {
    label          = 'Exam Ready'
    recommendation = 'Strong readiness signal. Take a final full PL-300 simulation, then book your exam.'
  } else if (score >= 70) {
    label          = 'Near Ready'
    recommendation = 'Close to the threshold. Targeted study on your risk areas should push you past 85.'
  } else if (score >= 55) {
    label          = 'On Track'
    recommendation = 'Good progress. Keep taking mixed-track exams and review the Concept Reviewer for weak areas.'
  } else {
    label          = 'Building Foundations'
    recommendation = 'Keep practicing. Full PL-300 exams build domain balance; walkthroughs help with reasoning.'
  }

  return {
    score,
    label,
    examsTaken:     history.length,
    avgScorePct:    Math.round(avgScore * 100),
    trend,
    strongAreas,
    riskAreas,
    domainAvgs,
    recommendation,
    seenCount,
    totalCount:     allQuestions.length,
    coveragePct:    Math.round(coveragePct * 100),
    repeatedTraps:  repeatedTraps.slice(0, 3),
  }
}
