import { isAnswerEmpty, isAnswerCorrect } from '../utils/answerUtils'

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E']

export default function StudyFeedback({ question, userAnswer }) {
  if (isAnswerEmpty(userAnswer, question)) return null

  const correct = isAnswerCorrect(userAnswer, question)

  // Per-choice wrong-answer explanations only apply to choice-based types
  const wrongExplanations = getWrongExplanations(question, userAnswer)

  return (
    <div className={`mt-4 rounded-xl border-2 p-5 ${correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-sm font-bold ${correct ? 'text-green-700' : 'text-red-700'}`}>
          {correct ? '✓ Correct' : '✗ Incorrect'}
        </span>
        {!correct && question.type === 'single' && (
          <span className="text-xs text-gray-600">
            · Correct: {question.correctAnswers.map(i => CHOICE_LABELS[i]).join(', ')}
          </span>
        )}
        {!correct && question.type === 'multiple' && (
          <span className="text-xs text-gray-600">
            · Correct: {question.correctAnswers.map(i => CHOICE_LABELS[i]).join(', ')}
          </span>
        )}
        {!correct && question.type === 'true_false' && (
          <span className="text-xs text-gray-600">
            · Correct answer: {question.correctAnswer ? 'True' : 'False'}
          </span>
        )}
      </div>

      {wrongExplanations.length > 0 && (
        <div className="mb-3 space-y-2">
          {wrongExplanations.map(({ label, text }) => (
            <div key={label} className="bg-white border border-red-200 rounded-lg px-3 py-2.5">
              <p className="text-xs font-semibold text-red-600 mb-1">{label}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}

      {question.explanation && (
        <div className={`rounded-lg p-3 ${correct ? 'bg-white border border-green-200' : 'bg-white border border-gray-200'}`}>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Explanation: </span>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

function getWrongExplanations(question, userAnswer) {
  if (!question.choiceExplanations) return []
  const selected = question.type === 'multiple'
    ? (Array.isArray(userAnswer) ? userAnswer : [])
    : (userAnswer !== null && userAnswer !== undefined ? [userAnswer] : [])
  const wrong = selected.filter(i => !question.correctAnswers?.includes(i))
  return wrong.map(i => ({
    label: `${CHOICE_LABELS[i]}: ${question.choices[i]}`,
    text: question.choiceExplanations[i],
  }))
}
