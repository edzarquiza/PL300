import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExamHistory, clearHistory } from '../services/historyService'
import { formatTime } from '../utils/examUtils'
import { lookupQuestion } from '../utils/questionLookup'
import { isAnswerCorrect } from '../utils/answerUtils'
import { shuffleQuestionChoices } from '../services/examGenerator'
import { addToRetryQueue, removeFromRetryQueue, isInRetryQueue } from '../services/retryQueueService'
import { useExam } from '../context/ExamContext'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { startExam } = useExam()
  const [history, setHistory] = useState(() => getExamHistory())
  const [showConfirm, setShowConfirm] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)

  function handleRetake(entry) {
    if (!entry.questionIds?.length) return
    startExam({
      questionIds: entry.questionIds,
      questionCount: entry.questionIds.length,
      examMode: entry.mode ?? 'exam',
      track: entry.trackId ?? 'full_pl300',
    })
    navigate('/exam')
  }

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
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-3">
                    {hasAnswers ? (
                      <button
                        onClick={() => toggleExpand(i)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {isExpanded ? '▲ Hide answers' : `▼ Review ${entry.questionIds.length} answers`}
                      </button>
                    ) : <span />}
                    {hasAnswers && (
                      <button
                        onClick={() => handleRetake(entry)}
                        className="text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                      >
                        ↺ Retake
                      </button>
                    )}
                  </div>

                  {isExpanded && hasAnswers && (
                    <AnswerReview questionIds={entry.questionIds} answers={entry.answers} questionResults={entry.questionResults ?? {}} examSeed={entry.examSeed ?? null} />
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

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E']

function getAnswerDetail(q, answer) {
  if (!q || answer === null || answer === undefined) return null

  switch (q.type) {
    case 'single': {
      if (typeof answer !== 'number') return null
      const correctIdx = q.correctAnswers?.[0]
      return {
        userLabel: CHOICE_LABELS[answer],
        userText: q.choices?.[answer],
        correctLabel: CHOICE_LABELS[correctIdx],
        correctText: q.choices?.[correctIdx],
        wrongExplanation: answer !== correctIdx ? (q.choiceExplanations?.[answer] ?? null) : null,
        isCorrect: answer === correctIdx,
      }
    }
    case 'multi': {
      if (!Array.isArray(answer)) return null
      const correct = [...(q.correctAnswers ?? [])].sort((a, b) => a - b)
      return {
        userLabels: answer.map(i => CHOICE_LABELS[i]).join(', '),
        correctLabels: correct.map(i => CHOICE_LABELS[i]).join(', '),
        isCorrect: isAnswerCorrect(answer, q),
      }
    }
    case 'true_false': {
      if (answer !== true && answer !== false) return null
      return {
        userText: answer ? 'True' : 'False',
        correctText: q.correctAnswer ? 'True' : 'False',
        isCorrect: answer === q.correctAnswer,
      }
    }
    case 'drag_drop': {
      if (typeof answer !== 'object' || Array.isArray(answer)) return null
      return {
        dragDropPrompts: q.prompts ?? [],
        dragDropUser: answer,
        dragDropCorrect: q.correctMapping ?? {},
        isCorrect: isAnswerCorrect(answer, q),
      }
    }
    case 'rearrange_steps': {
      if (!Array.isArray(answer)) return null
      return {
        rearrangeUser: answer,
        rearrangeCorrect: q.correctOrder ?? [],
        isCorrect: isAnswerCorrect(answer, q),
      }
    }
    default:
      return null
  }
}

function RetryButton({ questionId }) {
  const [inQueue, setInQueue] = useState(() => isInRetryQueue(questionId))
  function toggle() {
    if (inQueue) { removeFromRetryQueue(questionId); setInQueue(false) }
    else         { addToRetryQueue(questionId);      setInQueue(true)  }
  }
  return (
    <button
      onClick={toggle}
      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
        inQueue
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {inQueue ? '✓ Queued' : '+ Retry Later'}
    </button>
  )
}

function AnswerReview({ questionIds, answers, questionResults, examSeed }) {
  const rows = questionIds.map((id, index) => {
    const original = lookupQuestion(id)
    // Reconstruct the same choice order the user saw during the exam, since
    // correctAnswers/choiceExplanations are remapped per-seed at shuffle time.
    const q = original && examSeed ? shuffleQuestionChoices(original, examSeed) : original
    const answer = answers[id] ?? answers[String(id)]
    // Use stored correctness (computed at exam time against shuffled questions).
    // Fall back to live recomputation only for old history entries that lack questionResults.
    const stored = questionResults[id] ?? questionResults[String(id)]
    const correct = stored !== undefined ? stored : (q ? isAnswerCorrect(answer, q) : null)
    const detail = getAnswerDetail(q, answer)
    return { index, id, q, answer, correct, detail }
  })

  const correctCount = rows.filter(r => r.correct === true).length

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-gray-400 mb-2">
        {correctCount} / {rows.length} correct
      </p>
      {rows.map(({ index, id, q, correct, detail }) => (
        <div
          key={id}
          className={`rounded-lg text-xs border ${
            correct === true
              ? 'bg-green-50 border-green-100'
              : correct === false
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-100'
          }`}
        >
          {/* Question header */}
          <div className="flex items-start gap-2.5 px-3 py-2.5">
            <span className={`flex-shrink-0 font-bold mt-0.5 ${
              correct === true ? 'text-green-600' : correct === false ? 'text-red-500' : 'text-gray-400'
            }`}>
              {correct === true ? '✓' : correct === false ? '✗' : '—'}
            </span>
            <div className="min-w-0">
              <span className="text-gray-400 mr-1.5">Q{index + 1}.</span>
              {q ? (
                <>
                  <span className="text-gray-700 font-medium">
                    {q.question.length > 120 ? q.question.slice(0, 120) + '…' : q.question}
                  </span>
                  <span className="ml-1.5 text-gray-400">· {q.subtopic}</span>
                </>
              ) : (
                <span className="text-gray-400 italic">Question no longer available</span>
              )}
            </div>
          </div>

          {/* Answer detail — shown for all answered questions */}
          {detail && q && (
            <div className="border-t border-current border-opacity-10 px-3 pb-3 pt-2 space-y-1.5">

              {/* Single choice */}
              {detail.userLabel && (
                <>
                  <div className={`flex items-start gap-1.5 ${correct ? 'text-green-800' : 'text-red-800'}`}>
                    <span className="flex-shrink-0 font-semibold">{detail.userLabel}.</span>
                    <span className="leading-snug">{detail.userText}</span>
                    <span className="flex-shrink-0 ml-auto pl-2 font-semibold">
                      {correct ? '✓ your pick' : '✗ your pick'}
                    </span>
                  </div>
                  {!correct && detail.correctLabel && (
                    <div className="flex items-start gap-1.5 text-green-800">
                      <span className="flex-shrink-0 font-semibold">{detail.correctLabel}.</span>
                      <span className="leading-snug">{detail.correctText}</span>
                      <span className="flex-shrink-0 ml-auto pl-2 font-semibold text-green-600">✓ correct</span>
                    </div>
                  )}
                  {detail.wrongExplanation && (
                    <p className="mt-1 text-red-700 leading-relaxed bg-red-100 rounded px-2 py-1.5 border border-red-200">
                      {detail.wrongExplanation}
                    </p>
                  )}
                </>
              )}

              {/* Multiple choice */}
              {detail.userLabels && (
                <>
                  <div className={`${correct ? 'text-green-800' : 'text-red-800'}`}>
                    <span className="font-semibold">Your answer: </span>
                    {detail.userLabels}
                    {correct && <span className="ml-1.5 font-semibold text-green-600">✓</span>}
                  </div>
                  {!correct && (
                    <div className="text-green-800">
                      <span className="font-semibold">Correct: </span>
                      {detail.correctLabels}
                    </div>
                  )}
                </>
              )}

              {/* True / False */}
              {detail.userText && !detail.userLabel && (
                <>
                  <div className={`${correct ? 'text-green-800' : 'text-red-800'}`}>
                    <span className="font-semibold">Your answer: </span>
                    {detail.userText}
                    {correct && <span className="ml-1.5 font-semibold text-green-600">✓</span>}
                  </div>
                  {!correct && (
                    <div className="text-green-800">
                      <span className="font-semibold">Correct: </span>
                      {detail.correctText}
                    </div>
                  )}
                </>
              )}

              {/* Drag & Drop matching */}
              {detail.dragDropPrompts && detail.dragDropPrompts.map(prompt => {
                const userChoice = detail.dragDropUser[prompt]
                const correctChoice = detail.dragDropCorrect[prompt]
                const ok = userChoice === correctChoice
                return (
                  <div key={prompt} className={ok ? 'text-green-800' : 'text-red-800'}>
                    <span className="font-semibold">{prompt}: </span>
                    {userChoice ?? '—'}
                    {!ok && <span className="ml-1.5 text-green-800">· correct: {correctChoice}</span>}
                  </div>
                )
              })}

              {/* Sequence ordering */}
              {detail.rearrangeCorrect && detail.rearrangeCorrect.map((step, i) => {
                const userIdx = detail.rearrangeUser.indexOf(step)
                const ok = userIdx === i
                return (
                  <div key={step} className={ok ? 'text-green-800' : 'text-red-800'}>
                    <span className="font-semibold">{i + 1}. </span>{step}
                    {!ok && <span className="ml-1.5">· you placed #{userIdx >= 0 ? userIdx + 1 : '—'}</span>}
                  </div>
                )
              })}
            </div>
          )}

          {/* Retry button for wrong answers */}
          {correct === false && q && (
            <div className="border-t border-current border-opacity-10 px-3 py-2 flex justify-end">
              <RetryButton questionId={id} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
