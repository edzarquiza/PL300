const LABELS = ['A', 'B', 'C', 'D', 'E']

function PartQuestion({ part, partIndex, partCount, answer, onAnswer, isReviewMode }) {
  function choiceStyle(i) {
    if (isReviewMode) {
      const correct = part.correctAnswers.includes(i)
      const user = answer === i
      if (correct) return 'border-green-400 bg-green-50'
      if (user && !correct) return 'border-red-400 bg-red-50'
      return 'border-gray-200 bg-white opacity-60'
    }
    return answer === i
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
  }

  function markerStyle(i) {
    if (isReviewMode) {
      const correct = part.correctAnswers.includes(i)
      const user = answer === i
      if (correct) return 'border-green-500 bg-green-500 text-white'
      if (user && !correct) return 'border-red-500 bg-red-500 text-white'
      return 'border-gray-300 text-gray-400'
    }
    return answer === i
      ? 'border-blue-500 bg-blue-500 text-white'
      : 'border-gray-300 text-gray-500'
  }

  function reviewTag(i) {
    if (!isReviewMode) return null
    const correct = part.correctAnswers.includes(i)
    const user = answer === i
    if (correct && user) return <span className="text-xs font-semibold text-green-600 flex-shrink-0">✓ Correct</span>
    if (correct) return <span className="text-xs font-semibold text-green-600 flex-shrink-0">✓ Correct answer</span>
    if (user) return <span className="text-xs font-semibold text-red-600 flex-shrink-0">✗ Your answer</span>
    return null
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
          Part {partIndex + 1} of {partCount}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">{part.question}</p>

      <div className="space-y-2">
        {part.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => !isReviewMode && onAnswer(i)}
            disabled={isReviewMode}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 flex items-start gap-3 transition-colors ${choiceStyle(i)}`}
          >
            <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 rounded-full border-2 ${markerStyle(i)}`}>
              {LABELS[i]}
            </span>
            <span className="text-sm leading-relaxed flex-1 text-gray-700">{choice}</span>
            {reviewTag(i)}
          </button>
        ))}
      </div>

      {isReviewMode && part.explanation && (
        <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Part {partIndex + 1}: </span>
            {part.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

export default function MultiPartQuestion({ question, answer, onAnswer, isReviewMode }) {
  const partAnswers = (answer && typeof answer === 'object' && !Array.isArray(answer)) ? answer : {}

  function handlePartAnswer(partIndex, choiceIndex) {
    onAnswer({ ...partAnswers, [String(partIndex)]: choiceIndex })
  }

  return (
    <div className="space-y-4">
      {question.parts.map((part, i) => (
        <PartQuestion
          key={i}
          part={part}
          partIndex={i}
          partCount={question.parts.length}
          answer={partAnswers[String(i)] ?? null}
          onAnswer={idx => handlePartAnswer(i, idx)}
          isReviewMode={isReviewMode}
        />
      ))}
    </div>
  )
}
