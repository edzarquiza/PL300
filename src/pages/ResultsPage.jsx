import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReviewCard from '../components/ReviewCard'
import { formatTime } from '../utils/examUtils'
import {
  getConfidenceAnalytics,
  getSubtopicAnalytics,
  getTrapAnalytics,
  getTimingAnalytics,
} from '../services/analyticsService'
import { getSubtopicMastery, getConceptTrapHistory } from '../services/masteryService'
import { getExamHistory } from '../services/historyService'
import { getPsychologyAnalytics } from '../services/psychologyAnalyticsService'
import { EXAM_TRACKS } from '../data/examTracks'

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state) return null

  const { questions, answers, score, timeSpent, flagged = {}, mode = 'exam', domainBreakdown = [], confidence = {}, questionTimes = {}, trackId = 'full_pl300', examSeed = null, answerChanges = {} } = state
  const { correct, incorrect, unanswered, total, percentage, passed } = score
  const flaggedCount = Object.keys(flagged).length
  const isStudy = mode === 'study'
  const track = EXAM_TRACKS.find(t => t.id === trackId)
  const [seedCopied, setSeedCopied] = useState(false)

  function handleCopySeed() {
    if (!examSeed) return
    navigator.clipboard.writeText(examSeed).then(() => {
      setSeedCopied(true)
      setTimeout(() => setSeedCopied(false), 2000)
    })
  }

  const timingData = getTimingAnalytics(questions, questionTimes)
  const confidenceData = getConfidenceAnalytics(questions, answers, confidence)
  const subtopicData = getSubtopicAnalytics(questions, answers, confidence)
  const trapData = getTrapAnalytics(questions, answers, confidence)
  const psychData = getPsychologyAnalytics(questions, answers, answerChanges)

  const history = getExamHistory()
  const masteryData = getSubtopicMastery(history)
  const trapHistory = getConceptTrapHistory(history)

  const hasConfidenceRatings = Object.keys(confidence).length > 0
  const hasTraps = trapData.length > 0
  const weakSubtopics = subtopicData.slice(0, 5)
  const historicWeakSubtopics = masteryData.filter(s => s.pct < 70).slice(0, 5)
  const hasTrapHistory = trapHistory.length > 0

  const stats = [
    { label: 'Correct',    value: correct,              color: 'text-green-600' },
    { label: 'Incorrect',  value: incorrect,             color: 'text-red-500'   },
    { label: 'Unanswered', value: unanswered,            color: 'text-gray-400'  },
    { label: 'Time Spent', value: isStudy ? '—' : formatTime(timeSpent), color: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Score banner */}
      <div className={`py-14 ${isStudy ? 'bg-purple-600' : passed ? 'bg-green-600' : 'bg-red-500'}`}>
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          {isStudy ? (
            <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-3">
              Study Session · {track?.name ?? 'Full PL-300'}
            </p>
          ) : (
            <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-3">
              {passed ? 'Exam Passed' : 'Exam Failed'} · {track?.name ?? 'Full PL-300'}
            </p>
          )}
          <p className="text-8xl font-bold mb-3">{percentage}%</p>
          <p className="text-base font-medium opacity-90">
            {correct} of {total} correct
            {!isStudy && <span> &nbsp;·&nbsp; Passing score: 70%</span>}
          </p>
          {flaggedCount > 0 && (
            <p className="text-sm opacity-70 mt-1">
              {flaggedCount} question{flaggedCount !== 1 ? 's' : ''} were flagged for review
            </p>
          )}
          {examSeed && (
            <button
              onClick={handleCopySeed}
              className="mt-3 inline-flex items-center gap-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="font-mono bg-white/20 rounded px-2 py-0.5">{examSeed}</span>
              <span>{seedCopied ? '✓ Copied' : 'Copy to replay'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Domain breakdown */}
        {domainBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Performance by Domain
            </h2>
            <div className="space-y-3">
              {domainBreakdown.map(({ domain, correct: c, total: t, percentage: pct }) => (
                <div key={domain}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{domain}</span>
                    <span className={`text-xs font-semibold ${pct >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                      {c}/{t} · {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${pct >= 70 ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timing Analysis */}
        {timingData && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Timing Analysis</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{timingData.avgSeconds}s</p>
                <p className="text-xs text-gray-500 mt-1">Avg / Question</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${timingData.overTimeCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>{timingData.overTimeCount}</p>
                <p className="text-xs text-gray-500 mt-1">Over Estimated Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-700">{formatTime(timingData.totalSeconds)}</p>
                <p className="text-xs text-gray-500 mt-1">Total Active Time</p>
              </div>
            </div>
            {timingData.slowestDomain && (
              <p className="text-xs text-gray-500">
                Slowest domain: <span className="font-semibold text-gray-700">{timingData.slowestDomain}</span>
                {' '}({timingData.domainTiming[0]?.avg}s avg)
              </p>
            )}
          </div>
        )}

        {/* Confidence Analysis */}
        {hasConfidenceRatings && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Confidence Analysis</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{confidenceData.correctHighConfidence}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Correct + High Confidence</p>
                <p className="text-xs text-gray-500 mt-1">Solid knowledge</p>
              </div>
              <div className={`rounded-lg border p-4 text-center ${confidenceData.incorrectHighConfidence > 0 ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <p className={`text-2xl font-bold ${confidenceData.incorrectHighConfidence > 0 ? 'text-red-700' : 'text-gray-400'}`}>{confidenceData.incorrectHighConfidence}</p>
                <p className={`text-xs font-medium mt-1 ${confidenceData.incorrectHighConfidence > 0 ? 'text-red-600' : 'text-gray-400'}`}>Wrong + High Confidence</p>
                <p className="text-xs text-gray-500 mt-1">False confidence — study these</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{confidenceData.correctLowConfidence}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">Correct + Low Confidence</p>
                <p className="text-xs text-gray-500 mt-1">Lucky or underestimating</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{confidenceData.incorrectLowConfidence}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Wrong + Low Confidence</p>
                <p className="text-xs text-gray-400 mt-1">Known gaps</p>
              </div>
            </div>
            {confidenceData.incorrectHighConfidence > 0 && (
              <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-semibold">
                  ⚠ {confidenceData.incorrectHighConfidence} false-confidence miss{confidenceData.incorrectHighConfidence !== 1 ? 'es' : ''} — these are your highest-risk gaps.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Subtopic Insights */}
        {weakSubtopics.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Weakest Subtopics</h2>
            <div className="space-y-3">
              {weakSubtopics.map(({ subtopic, correct: c, total: t, rawPct }) => (
                <div key={subtopic}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 truncate max-w-[220px]">{subtopic}</span>
                    <span className={`font-semibold flex-shrink-0 ml-2 ${rawPct >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                      {c}/{t} · {rawPct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${rawPct >= 70 ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${rawPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trap Patterns */}
        {hasTraps && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Conceptual Traps Triggered</h2>
            <div className="space-y-3">
              {trapData.map(({ trapType, count, highConfidenceCount }) => (
                <div key={trapType} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{trapType}</p>
                    {highConfidenceCount > 0 && (
                      <p className="text-xs text-red-500 mt-0.5">
                        {highConfidenceCount} false-confidence miss{highConfidenceCount !== 1 ? 'es' : ''}
                      </p>
                    )}
                  </div>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${highConfidenceCount > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exam Behaviour */}
        {psychData && (psychData.totalChanges > 0 || questions.length >= 10) && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Exam Behaviour</h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-700">{psychData.totalChanges}</p>
                <p className="text-xs text-gray-500 mt-1">Answer Changes</p>
              </div>
              <div className={`text-center ${psychData.changedToWrong > 0 ? '' : ''}`}>
                <p className={`text-2xl font-bold ${psychData.changedToWrong > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {psychData.changedToWrong}
                </p>
                <p className="text-xs text-gray-500 mt-1">Changed to Wrong</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${psychData.changedToRight > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {psychData.changedToRight}
                </p>
                <p className="text-xs text-gray-500 mt-1">Changed to Right</p>
              </div>
            </div>

            {psychData.changedToWrong > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs text-red-700 font-semibold">
                  You changed {psychData.changedToWrong} correct answer{psychData.changedToWrong !== 1 ? 's' : ''} to incorrect ones. Trust your first instinct more on conceptual questions.
                </p>
              </div>
            )}

            {psychData.mostChanged.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-400 mb-2">Most Hesitated Questions</p>
                <div className="space-y-1.5">
                  {psychData.mostChanged.map(({ subtopic, changes }) => (
                    <div key={subtopic + changes} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate max-w-[220px]">{subtopic}</span>
                      <span className="text-amber-600 font-semibold flex-shrink-0 ml-2">{changes} changes</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {psychData.stamina.firstHalfPct !== null && psychData.stamina.secondHalfPct !== null && (
              <div className={`rounded-lg p-3 ${psychData.stamina.hasIssue ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-xs font-semibold text-gray-600 mb-1">Exam Stamina</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-600">First half: <strong className="text-gray-800">{psychData.stamina.firstHalfPct}%</strong></span>
                  <span className="text-gray-400">→</span>
                  <span className={`${psychData.stamina.hasIssue ? 'text-amber-700' : 'text-gray-600'}`}>
                    Second half: <strong>{psychData.stamina.secondHalfPct}%</strong>
                  </span>
                  {psychData.stamina.hasIssue && (
                    <span className="text-amber-600 font-semibold">↓ {psychData.stamina.drop}pt drop</span>
                  )}
                </div>
                {psychData.stamina.hasIssue && (
                  <p className="text-xs text-amber-700 mt-1.5">
                    Accuracy declined in the second half — consider pacing strategy for longer exams.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cumulative Mastery (across all sessions) */}
        {historicWeakSubtopics.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Cumulative Mastery — Weakest Subtopics</h2>
            <p className="text-xs text-gray-400 mb-4">Aggregated across all past sessions</p>
            <div className="space-y-3">
              {historicWeakSubtopics.map(({ subtopic, correct: c, total: t, pct, trend }) => (
                <div key={subtopic}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 truncate max-w-[200px]">{subtopic}</span>
                    <span className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {trend === 'improving' && <span className="text-green-500 text-xs">↑</span>}
                      {trend === 'declining' && <span className="text-red-400 text-xs">↓</span>}
                      <span className={`font-semibold ${pct >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                        {c}/{t} · {pct}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recurring Trap History */}
        {hasTrapHistory && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Recurring Conceptual Traps</h2>
            <p className="text-xs text-gray-400 mb-4">Patterns detected across multiple sessions</p>
            <div className="space-y-3">
              {trapHistory.slice(0, 5).map(({ trapType, count, highConfidenceCount, sessions }) => (
                <div key={trapType} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{trapType}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {count} miss{count !== 1 ? 'es' : ''} across {sessions} session{sessions !== 1 ? 's' : ''}
                      {highConfidenceCount > 0 && (
                        <span className="text-red-500 font-medium"> · {highConfidenceCount} false-confident</span>
                      )}
                    </p>
                  </div>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-3 ${
                    highConfidenceCount > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex-1 py-3 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            View History
          </button>
          <button
            onClick={() => navigate('/')}
            className={`flex-1 py-3 text-sm font-semibold text-white rounded-xl transition-colors ${
              isStudy ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Try Again
          </button>
        </div>

        {/* Answer review */}
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
          Answer Review — {total} Questions
        </h2>
        <div className="space-y-5 pb-12">
          {questions.map((q, i) => (
            <ReviewCard
              key={q.id}
              question={q}
              userAnswer={answers[q.id] ?? null}
              questionNumber={i + 1}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
