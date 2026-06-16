import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../context/ExamContext'
import { getExamHistory, getWeakDomains } from '../services/historyService'
import { EXAM_TRACKS, TRACK_COLORS } from '../data/examTracks'
import { parseSeed } from '../services/examGenerator'
import { getRetryQueue, clearRetryQueue } from '../services/retryQueueService'
import { getPoolCoverage, getTrackPool, getPrioritizeUnseen, setPrioritizeUnseen } from '../services/exposureTrackingService'
import { getTopWeakConcepts } from '../services/conceptCoverageService'
import ReadinessWidget from '../components/ReadinessWidget'
import allQuestions from '../data/questions.json'

const COUNT_OPTIONS = [10, 20, 30, 50]

const DIFFICULTY_COLORS = {
  Easy:   { active: 'border-green-500 bg-green-50 text-green-700',  inactive: 'border-gray-200 text-gray-500 hover:border-green-300'  },
  Medium: { active: 'border-amber-500 bg-amber-50 text-amber-700',  inactive: 'border-gray-200 text-gray-500 hover:border-amber-300'  },
  Hard:   { active: 'border-red-500   bg-red-50   text-red-700',    inactive: 'border-gray-200 text-gray-500 hover:border-red-300'    },
}

export default function HomePage() {
  const navigate = useNavigate()
  const { allDifficulties, savedSession, startExam, restoreSession, discardSavedSession } = useExam()

  const [selectedTrack, setSelectedTrack] = useState('full_pl300')
  const [questionCount, setQuestionCount] = useState(20)
  const [selectedDifficulties, setSelectedDifficulties] = useState(allDifficulties)
  const [examMode, setExamMode] = useState('exam')
  const [seedInput, setSeedInput] = useState('')
  const [prioritizeUnseen, setPrioritizeUnseenState] = useState(() => getPrioritizeUnseen())

  const history    = getExamHistory()
  const weakDomains = getWeakDomains(history)
  const retryQueue = getRetryQueue()

  // Coverage stats per track (computed once on mount)
  const trackCoverage = useMemo(() => {
    const out = {}
    for (const t of EXAM_TRACKS) {
      const pool = getTrackPool(allQuestions, t)
      out[t.id] = getPoolCoverage(pool)
    }
    return out
  }, [])

  // Top weak concepts for the insight panel
  const weakConcepts = useMemo(() => getTopWeakConcepts(allQuestions, 6), [])

  function handleToggleUnseen() {
    const next = !prioritizeUnseen
    setPrioritizeUnseenState(next)
    setPrioritizeUnseen(next)
  }

  const track = EXAM_TRACKS.find(t => t.id === selectedTrack) ?? EXAM_TRACKS[0]

  // Estimate available questions for the selected track + difficulty
  const filteredPool = getTrackPool(allQuestions, track).filter(q => {
    if (selectedDifficulties.length && !selectedDifficulties.includes(q.difficulty)) return false
    return true
  })
  const availableCount = filteredPool.length

  const effectiveCount = questionCount === Infinity
    ? availableCount
    : Math.min(questionCount, availableCount)
  const estimatedMinutes = examMode === 'study' ? null : Math.round(effectiveCount * 132 / 60)

  function toggleDifficulty(d) {
    setSelectedDifficulties(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    )
  }

  function handleStart() {
    if (availableCount === 0) return
    const allDifficultiesSelected = selectedDifficulties.length === allDifficulties.length
    startExam({
      questionCount: effectiveCount,
      domains: [],
      difficulties: allDifficultiesSelected ? [] : selectedDifficulties,
      examMode,
      track: selectedTrack,
      seed: seedInput.trim() || null,
      prioritizeUnseen,
    })
    navigate('/exam')
  }

  function handleRetryQueue(count) {
    if (!retryQueue.length) return
    const ids = count === Infinity ? retryQueue : retryQueue.slice(0, count)
    startExam({
      questionIds: ids,
      questionCount: ids.length,
      examMode,
      track: selectedTrack,
    })
    navigate('/exam')
  }

  function handleDrillWeak() {
    if (!weakDomains.length) return
    startExam({
      questionCount: Math.min(20, availableCount),
      domains: weakDomains,
      difficulties: [],
      examMode: 'study',
      track: 'full_pl300',
    })
    navigate('/exam')
  }

  function handleRestore() {
    restoreSession()
    navigate('/exam')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white text-lg font-bold tracking-tight">PL</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">PL-300 Exam Simulator</h1>
          <p className="text-gray-400 text-sm">Microsoft Power BI Data Analyst · Passing score: 70%</p>
          <div className="grid grid-cols-2 gap-2 mt-5 sm:grid-cols-3 lg:grid-cols-6">
            <button
              onClick={() => navigate('/history')}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors"
            >
              <span className="text-sm font-semibold text-blue-700">Exam History</span>
              <span className="text-xs text-blue-400">Past results</span>
            </button>
            <button
              onClick={() => navigate('/reviewer')}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-colors"
            >
              <span className="text-sm font-semibold text-purple-700">Concept Reviewer</span>
              <span className="text-xs text-purple-400">Key concepts</span>
            </button>
            <button
              onClick={() => navigate('/dax')}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-teal-50 border border-teal-100 hover:bg-teal-100 hover:border-teal-200 transition-colors"
            >
              <span className="text-sm font-semibold text-teal-700">DAX Library</span>
              <span className="text-xs text-teal-400">Functions & syntax</span>
            </button>
            <button
              onClick={() => navigate('/walkthroughs')}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
            >
              <span className="text-sm font-semibold text-indigo-700">Walkthroughs</span>
              <span className="text-xs text-indigo-400">Visual learning</span>
            </button>
            <button
              onClick={() => navigate('/terminology')}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-colors"
            >
              <span className="text-sm font-semibold text-emerald-700">Terminology</span>
              <span className="text-xs text-emerald-400">Terms &amp; acronyms</span>
            </button>
            <button
              onClick={() => navigate('/relationship-lab')}
              className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:border-rose-200 transition-colors"
            >
              <span className="text-sm font-semibold text-rose-700">Relationship Lab</span>
              <span className="text-xs text-rose-400">Model simulations</span>
            </button>
          </div>
        </div>

        {/* Restore session banner */}
        {savedSession && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-800">Resume previous session</p>
              <p className="text-xs text-blue-600 mt-0.5">
                {savedSession.questions?.length} questions · {Object.keys(savedSession.answers || {}).length} answered
                {savedSession.mode === 'study' && ' · Study mode'}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={discardSavedSession}
                className="text-xs text-gray-500 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleRestore}
                className="text-xs font-semibold text-white px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Resume →
              </button>
            </div>
          </div>
        )}

        {/* Retry queue banner */}
        {retryQueue.length > 0 && !savedSession && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  Retry queue — {retryQueue.length} question{retryQueue.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-orange-600 mt-0.5">Questions you marked for review</p>
              </div>
              <button
                onClick={() => { clearRetryQueue(); window.location.reload() }}
                className="text-xs text-orange-400 hover:text-orange-600 transition-colors flex-shrink-0"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRetryQueue(10)}
                className="flex-1 text-xs font-semibold text-white px-3 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Quick Retry (10)
              </button>
              <button
                onClick={() => handleRetryQueue(Infinity)}
                className="flex-1 text-xs font-semibold text-orange-700 px-3 py-2 bg-orange-100 border border-orange-200 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Full Retry ({retryQueue.length})
              </button>
            </div>
          </div>
        )}

        {/* Weak domain drill banner */}
        {weakDomains.length > 0 && !savedSession && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-800">Weak areas detected</p>
              <p className="text-xs text-amber-700 mt-0.5">{weakDomains.slice(0, 2).join(' · ')}</p>
            </div>
            <button
              onClick={handleDrillWeak}
              className="text-xs font-semibold text-white px-3 py-1.5 bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex-shrink-0"
            >
              Drill weak topics →
            </button>
          </div>
        )}

        {/* Configuration card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">

          {/* Exam Track */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Exam Track</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EXAM_TRACKS.map(t => {
                const active = selectedTrack === t.id
                const c = TRACK_COLORS[t.color]
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTrack(t.id)}
                    className={`px-3 py-2.5 rounded-lg text-left border-2 transition-colors ${
                      active ? `${c.border} ${c.bg}` : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${active ? c.text : 'text-gray-700'}`}>{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight line-clamp-1">{t.description}</p>
                    {(() => {
                      const cov = trackCoverage[t.id]
                      if (!cov || cov.seen === 0) return (
                        <p className="text-xs text-gray-300 mt-1">{cov?.total ?? 0} questions</p>
                      )
                      return (
                        <div className="mt-1.5">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className={active ? c.text : 'text-gray-500'}>{cov.seen} seen</span>
                            <span className="text-gray-400">{cov.pct}%</span>
                          </div>
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${active ? c.bg.replace('bg-','bg-').replace('-50','') : 'bg-gray-400'}`}
                              style={{ width: `${cov.pct}%`, backgroundColor: active ? undefined : '#9ca3af' }}/>
                          </div>
                        </div>
                      )
                    })()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mode toggle */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Mode</p>
            <div className="flex gap-2">
              <button
                onClick={() => setExamMode('exam')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                  examMode === 'exam'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Exam
                <span className="block text-xs font-normal opacity-70 mt-0.5">Timed · No hints</span>
              </button>
              <button
                onClick={() => setExamMode('study')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                  examMode === 'study'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Study
                <span className="block text-xs font-normal opacity-70 mt-0.5">Untimed · Instant feedback</span>
              </button>
            </div>
          </div>

          {/* Question count */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Question Count</p>
            <div className="flex gap-2 flex-wrap">
              {COUNT_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    questionCount === n
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setQuestionCount(Infinity)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  questionCount === Infinity
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                All ({availableCount})
              </button>
            </div>
          </div>

          {/* Difficulty filter */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Difficulty</p>
            <div className="flex gap-2">
              {allDifficulties.map(d => {
                const active = selectedDifficulties.includes(d)
                const colors = DIFFICULTY_COLORS[d]
                return (
                  <button
                    key={d}
                    onClick={() => toggleDifficulty(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                      active ? colors.active : colors.inactive
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Prioritize Unseen toggle */}
          <div className="mb-5 flex items-center justify-between gap-4 py-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">Prioritize unseen questions</p>
              <p className="text-xs text-gray-400 mt-0.5">Exhausts new questions before repeating seen ones</p>
            </div>
            <button
              onClick={handleToggleUnseen}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                prioritizeUnseen ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                prioritizeUnseen ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Replay seed */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Replay Seed</p>
            <input
              type="text"
              value={seedInput}
              onChange={e => setSeedInput(e.target.value)}
              placeholder="e.g. PL300-4832  (leave blank for random)"
              className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
                seedInput && !parseSeed(seedInput)
                  ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-400'
                  : 'border-gray-200 focus:border-blue-400'
              }`}
            />
            {seedInput && parseSeed(seedInput) && (
              <p className="text-xs text-green-600 mt-1">Valid seed — this exam will be reproducible.</p>
            )}
            {seedInput && !parseSeed(seedInput) && (
              <p className="text-xs text-red-500 mt-1">Format: PL300-0000 or 4-digit number</p>
            )}
          </div>
        </div>

        {/* Readiness prediction */}
        <ReadinessWidget />

        {/* Concept coverage insight */}
        {weakConcepts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Concept Coverage</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {weakConcepts.map(({ concept, total, seen, masteryPct, coveragePct }) => (
                <div key={concept} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 truncate">{concept}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{seen}/{total} seen</span>
                    <span className={`text-xs font-bold ${
                      masteryPct === null ? 'text-gray-400' :
                      masteryPct < 50 ? 'text-red-600' :
                      masteryPct < 70 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {masteryPct === null ? 'New' : `${masteryPct}%`}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${coveragePct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability summary */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5 px-1">
          <span>
            {availableCount === 0
              ? 'No questions match your filters'
              : `${effectiveCount} question${effectiveCount !== 1 ? 's' : ''} · ${track.name}`}
          </span>
          {examMode === 'exam' && estimatedMinutes !== null && (
            <span className="text-gray-400">~{estimatedMinutes} min</span>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={availableCount === 0}
          className={`w-full py-4 text-white font-semibold rounded-xl transition-colors text-base disabled:opacity-40 disabled:cursor-not-allowed ${
            examMode === 'study'
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {examMode === 'study' ? `Start Study — ${track.name}` : `Start Exam — ${track.name}`}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Variant questions rotate automatically · Progress auto-saved · Passing score: 70%
        </p>

      </div>
    </div>
  )
}
