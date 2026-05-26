export default function TrueFalseQuestion({ question, answer, onAnswer, isReviewMode }) {
  function buttonStyle(value) {
    if (isReviewMode) {
      const correct = value === question.correctAnswer
      const user = value === answer
      if (correct) return 'border-green-400 bg-green-50 text-green-800'
      if (user && !correct) return 'border-red-400 bg-red-50 text-red-800'
      return 'border-gray-200 bg-white text-gray-400'
    }
    if (answer === value) return 'border-blue-500 bg-blue-50 text-blue-800'
    return 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
  }

  function statusLabel(value) {
    if (!isReviewMode) return null
    const correct = value === question.correctAnswer
    const user = value === answer
    if (correct && user) return <div className="text-xs font-semibold text-green-600 mt-2">✓ Correct</div>
    if (correct) return <div className="text-xs font-semibold text-green-600 mt-2">✓ Correct answer</div>
    if (user) return <div className="text-xs font-semibold text-red-600 mt-2">✗ Your answer</div>
    return null
  }

  return (
    <div className="flex gap-4">
      {[true, false].map(value => (
        <button
          key={String(value)}
          onClick={() => !isReviewMode && onAnswer(value)}
          disabled={isReviewMode}
          className={`flex-1 py-8 rounded-xl border-2 text-base font-semibold transition-colors ${buttonStyle(value)}`}
        >
          {value ? 'True' : 'False'}
          {statusLabel(value)}
        </button>
      ))}
    </div>
  )
}
