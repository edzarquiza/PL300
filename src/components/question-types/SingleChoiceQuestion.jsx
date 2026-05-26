const LABELS = ['A', 'B', 'C', 'D', 'E']

export default function SingleChoiceQuestion({ question, answer, onAnswer, isReviewMode }) {
  function choiceStyle(i) {
    if (isReviewMode) {
      const correct = question.correctAnswers.includes(i)
      const user = answer === i
      if (correct) return 'border-green-400 bg-green-50'
      if (user) return 'border-red-400 bg-red-50'
      return 'border-gray-200 bg-white opacity-60'
    }
    return answer === i
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
  }

  function markerStyle(i) {
    if (isReviewMode) {
      const correct = question.correctAnswers.includes(i)
      const user = answer === i
      if (correct) return 'border-green-500 bg-green-500 text-white'
      if (user) return 'border-red-500 bg-red-500 text-white'
      return 'border-gray-300 text-gray-400'
    }
    return answer === i
      ? 'border-blue-500 bg-blue-500 text-white'
      : 'border-gray-300 text-gray-500'
  }

  function reviewTag(i) {
    if (!isReviewMode) return null
    const correct = question.correctAnswers.includes(i)
    const user = answer === i
    if (correct && user) return <span className="text-xs font-semibold text-green-600 flex-shrink-0">✓ Correct</span>
    if (correct) return <span className="text-xs font-semibold text-green-600 flex-shrink-0">✓ Correct answer</span>
    if (user) return <span className="text-xs font-semibold text-red-600 flex-shrink-0">✗ Your answer</span>
    return null
  }

  return (
    <div className="space-y-3">
      {question.choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => !isReviewMode && onAnswer(i)}
          disabled={isReviewMode}
          className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-colors flex items-start gap-4 ${choiceStyle(i)}`}
        >
          <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 rounded-full border-2 ${markerStyle(i)}`}>
            {LABELS[i]}
          </span>
          <span className={`text-sm leading-relaxed flex-1 ${answer === i && !isReviewMode ? 'text-blue-900' : 'text-gray-700'}`}>
            {choice}
          </span>
          {reviewTag(i)}
        </button>
      ))}
    </div>
  )
}
