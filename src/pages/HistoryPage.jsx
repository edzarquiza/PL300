import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExamHistory, clearHistory } from '../services/historyService'
import { formatTime } from '../utils/examUtils'
import { lookupQuestion } from '../utils/questionLookup'
import { isAnswerCorrect } from '../utils/answerUtils'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState(() => getExamHistory())
  const [showConfirm, setShowConfirm] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)

  function handleClear() {
    clearHistory()
    setHistory([])
    setShowConfirm(false)
    setExpandedIndex(null)
  }

  function toggleExpand(i) {
    setExpandedIndex(prev => (prev === i ? null : i))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-base font-semibold text-gray-900">Exam History</h1>
          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Clear all
            </button>
          )}
          {history.length === 0 && <span />}
        </div>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Clear all history?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {history.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No exam history yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 text-sm hover:text-blue-700"
            >
              Take your first exam →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry, i) => {
              const date = new Date(entry.savedAt)
              const isStudy = entry.mode === 'study'
              const { correct, total, percentage, passed } = entry.score
              const hasAnswers = entry.questionIds?.length > 0
              const isExpanded = expandedIndex === i

              return (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-2xl font-bold ${isStudy ? 'text-purple-600' : passed ? 'text-green-600' : 'text-red-500'}`}>
                          {percentage}%
                        </span>
                        {!isStudy && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {passed ? 'Passed' : 'Failed'}
                          </span>
                        )}
                        {isStudy && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            Study
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {correct}/{total} correct
                        {entry.timeSpent && !isStudy && <span> · {formatTime(entry.timeSpent)}</span>}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 text-right">
                      {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      <br />
                      {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Domain breakdown */}
                  {entry.domainBreakdown?.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {entry.domainBreakdown.map(({ domain, correct: c, total: t, percentage: pct }) => (
                        <div key={domain}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 truncate max-w-[200px]">{domain}</span>
                            <span className={`font-semibold flex-shrink-0 ml-2 ${pct >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                              {c}/{t} · {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${pct >= 70 ? 'bg-green-500' : 'bg-red-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Answer review toggle */}
                  {hasAnswers && (
                    <div className="border-t border-gray-100 pt-3">
                      <button
                        onClick={() => toggleExpand(i)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {isExpanded ? '▲ Hide answers' : `▼ Review ${entry.questionIds.length} answers`}
                      </button>

                      {isExpanded && (
                        <AnswerReview questionIds={entry.questionIds} answers={entry.answers} />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function AnswerReview({ questionIds, answers }) {
  const rows = questionIds.map((id, index) => {
    const q = lookupQuestion(id)
    const answer = answers[id] ?? answers[String(id)]
    const correct = q ? isAnswerCorrect(answer, q) : null
    return { index, id, q, answer, correct }
  })

  const correctCount = rows.filter(r => r.correct === true).length

  return (
    <div className="mt-3 space-y-1">
      <p className="text-xs text-gray-400 mb-2">
        {correctCount} / {rows.length} correct
      </p>
      {rows.map(({ index, id, q, correct }) => (
        <div
          key={id}
          className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-xs ${
            correct === true
              ? 'bg-green-50 border border-green-100'
              : correct === false
              ? 'bg-red-50 border border-red-100'
              : 'bg-gray-50 border border-gray-100'
          }`}
        >
          <span className={`flex-shrink-0 font-bold mt-0.5 ${
            correct === true ? 'text-green-600' : correct === false ? 'text-red-500' : 'text-gray-400'
          }`}>
            {correct === true ? '✓' : correct === false ? '✗' : '—'}
          </span>
          <div className="min-w-0">
            <span className="text-gray-400 mr-1.5">Q{index + 1}.</span>
            {q ? (
              <>
                <span className="text-gray-700 font-medium">{q.question.length > 100 ? q.question.slice(0, 100) + '…' : q.question}</span>
                <span className="ml-1.5 text-gray-400">· {q.subtopic}</span>
              </>
            ) : (
              <span className="text-gray-400 italic">Question no longer available</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
