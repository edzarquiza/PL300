import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../context/ExamContext'
import { useExamTimer } from '../hooks/useExamTimer'
import { useKeyboardNav } from '../hooks/useKeyboardNav'
import { calculateScore, getDomainBreakdown, getSubtopicBreakdown, computeNewAnswer } from '../utils/examUtils'
import { isAnswerEmpty } from '../utils/answerUtils'
import { saveExamResult } from '../services/historyService'
import { getTrapAnalytics } from '../services/analyticsService'
import QuestionCard from '../components/QuestionCard'
import QuestionPalette from '../components/QuestionPalette'
import StudyFeedback from '../components/StudyFeedback'
import ConfidenceRating from '../components/ConfidenceRating'
import ProgressBar from '../components/ProgressBar'
import Timer from '../components/Timer'

export default function ExamPage() {
  const navigate = useNavigate()
  const {
    questions, answers, flagged, confidence, questionTimes,
    currentIndex, examStartTime, examDuration,
    isActive, mode, trackId, examSeed, answerChanges, totalQuestions, answeredCount,
    setAnswer, setConfidence, recordQuestionTime, toggleFlag, goTo, endExam,
  } = useExam()

  const [showSubmitWarning, setShowSubmitWarning] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const questionStartRef = useRef(Date.now())

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === totalQuestions - 1
  const flaggedCount = Object.keys(flagged).length
  const isStudy = mode === 'study'

  useEffect(() => {
    if (!isActive || questions.length === 0) navigate('/', { replace: true })
  }, [isActive, questions.length, navigate])

  useEffect(() => {
    questionStartRef.current = Date.now()
  }, [currentIndex])

  const initialTimeLeft = useMemo(() => {
    if (!examStartTime) return examDuration
    const elapsed = Math.round((Date.now() - examStartTime) / 1000)
    return Math.max(1, examDuration - elapsed)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function flushCurrentQuestionTime() {
    if (!currentQuestion) return
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000)
    if (elapsed > 0) recordQuestionTime(currentQuestion.id, elapsed)
    questionStartRef.current = Date.now()
  }

  function goToResults() {
    if (!isActive || questions.length === 0) return
    // Build final times synchronously — state update from flushCurrentQuestionTime
    // is async, so we compute the last flush manually here to avoid stale closure.
    const elapsed = currentQuestion
      ? Math.round((Date.now() - questionStartRef.current) / 1000)
      : 0
    const finalTimes = { ...questionTimes }
    if (currentQuestion && elapsed > 0) {
      finalTimes[currentQuestion.id] = (finalTimes[currentQuestion.id] || 0) + elapsed
    }
    const timeSpent = Math.round((Date.now() - examStartTime) / 1000)
    const score = calculateScore(questions, answers)
    const domainBreakdown = getDomainBreakdown(questions, answers)
    const subtopicBreakdown = getSubtopicBreakdown(questions, answers)
    const trapStats = getTrapAnalytics(questions, answers, confidence)
    endExam()
    saveExamResult({ score, domainBreakdown, subtopicBreakdown, mode, timeSpent, questionCount: questions.length, confidence, questionTimes: finalTimes, trapStats, trackId })
    navigate('/results', {
      state: { questions, answers, score, timeSpent, flagged, mode, domainBreakdown, confidence, questionTimes: finalTimes, trackId, examSeed, answerChanges },
    })
  }

  const timeLeft = useExamTimer(initialTimeLeft, isStudy ? null : goToResults)

  function handleSelectAnswer(answer) {
    setAnswer(currentQuestion.id, answer)
    if (showSubmitWarning) setShowSubmitWarning(false)
  }

  function handleSelectChoice(choiceIndex) {
    const type = currentQuestion?.type
    if (!type || !['single', 'multiple'].includes(type)) return
    const current = answers[currentQuestion.id] ?? null
    handleSelectAnswer(computeNewAnswer(currentQuestion, current, choiceIndex))
  }

  function handlePrevious() {
    flushCurrentQuestionTime()
    goTo(prev => Math.max(0, prev - 1))
    setShowSubmitWarning(false)
  }

  function handleNext() {
    flushCurrentQuestionTime()
    goTo(prev => Math.min(totalQuestions - 1, prev + 1))
    setShowSubmitWarning(false)
  }

  function handleJump(index) {
    flushCurrentQuestionTime()
    goTo(index)
    setShowSubmitWarning(false)
  }

  function handleSubmitClick() {
    const unanswered = totalQuestions - answeredCount
    if (unanswered > 0 && !showSubmitWarning) {
      setShowSubmitWarning(true)
      return
    }
    goToResults()
  }

  useKeyboardNav({
    onPrev: handlePrevious,
    onNext: isLastQuestion ? undefined : handleNext,
    onSelectChoice: handleSelectChoice,
    onFlag: () => toggleFlag(currentQuestion?.id),
    enabled: !showExitConfirm,
  })

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Exit confirmation overlay */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Leave session?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Your progress will be saved. You can resume this session from the home screen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Stay
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Exit
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              Q {currentIndex + 1} / {totalQuestions}
            </span>
            {isStudy ? (
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                Study
              </span>
            ) : (
              <>
                <span className="text-gray-300 select-none">|</span>
                <Timer timeLeft={timeLeft} />
              </>
            )}
          </div>
          <span className="text-sm text-gray-400">
            {answeredCount} / {totalQuestions} answered
          </span>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <ProgressBar current={answeredCount} total={totalQuestions} />
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">

        {/* Flag button row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">Question {currentIndex + 1}</span>
          <button
            onClick={() => toggleFlag(currentQuestion.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              flagged[currentQuestion.id]
                ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {flagged[currentQuestion.id] ? '⚑ Flagged for Review' : '⚐ Flag for Review'}
          </button>
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] ?? null}
          onSelectAnswer={handleSelectAnswer}
        />

        {!isAnswerEmpty(answers[currentQuestion.id], currentQuestion) && (
          <ConfidenceRating
            value={confidence[currentQuestion.id] ?? null}
            onChange={level => setConfidence(currentQuestion.id, level)}
          />
        )}

        {isStudy && (
          <StudyFeedback
            question={currentQuestion}
            userAnswer={answers[currentQuestion.id] ?? null}
          />
        )}

        <QuestionPalette
          questions={questions}
          answers={answers}
          flagged={flagged}
          currentIndex={currentIndex}
          onSelect={handleJump}
        />
      </main>

      {/* Sticky footer */}
      <footer className="bg-white border-t border-gray-200 sticky bottom-0">

        {showSubmitWarning && (
          <div className="max-w-3xl mx-auto px-4 pt-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">{totalQuestions - answeredCount} unanswered</span>
                {flaggedCount > 0 && <span> · <span className="font-semibold">{flaggedCount} flagged</span></span>}
                <span> · Submit anyway?</span>
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowSubmitWarning(false)}
                  className="text-xs font-medium text-gray-600 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={goToResults}
                  className="text-xs font-medium text-white px-3 py-1.5 bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Submit Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitClick}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors ${
                isStudy ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isStudy ? 'Finish Session' : 'Submit Exam'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </footer>

    </div>
  )
}
