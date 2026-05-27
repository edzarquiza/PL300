import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../context/ExamContext'
import { getExamHistory, getWeakDomains } from '../services/historyService'
import { EXAM_TRACKS, TRACK_COLORS } from '../data/examTracks'
import { parseSeed } from '../services/examGenerator'
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

  const history = getExamHistory()
  const weakDomains = getWeakDomains(history)

  const track = EXAM_TRACKS.find(t => t.id === selectedTrack) ?? EXAM_TRACKS[0]

  // Estimate available questions for the selected track + difficulty
  const trackDomains = Object.keys(track.domainWeights)
  const filteredPool = allQuestions.filter(q => {
    if (!trackDomains.includes(q.domain)) return false
    if (selectedDifficulties.length && !selectedDifficulties.includes(q.difficulty)) return false
    return true
  })
  const availableCount = filteredPool.length

  const defaultCount = track.defaultQuestionCount
  const effectiveCount = questionCount === Infinity
    ? availableCount
    : Math.min(questionCount, availableCount, defaultCount * 2)
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
          <div className="grid grid-cols-3 gap-2 mt-5">
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
                All ({allQuestions.length})
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
