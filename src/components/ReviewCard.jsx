import { isAnswerEmpty, isAnswerCorrect } from '../utils/answerUtils'
import QuestionRenderer from './question-types/QuestionRenderer'
import VisualQuestionContext from './VisualQuestionContext'

const TYPE_LABEL = {
  multiple:        'Multiple choice',
  true_false:      'True or False',
  drag_drop:       'Drag & Drop',
  rearrange_steps: 'Arrange in Order',
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E']

function ChoiceExplanations({ question, userAnswer }) {
  if (!question.choiceExplanations) return null
  if (question.type !== 'single' && question.type !== 'multiple') return null

  const selected = question.type === 'multiple'
    ? (Array.isArray(userAnswer) ? userAnswer : [])
    : (userAnswer !== null && userAnswer !== undefined ? [userAnswer] : [])

  const entries = Object.entries(question.choiceExplanations).map(([idx, text]) => {
    const i = Number(idx)
    const isCorrectChoice = question.correctAnswers?.includes(i)
    const wasSelected = selected.includes(i)
    return { i, text, isCorrectChoice, wasSelected }
  }).filter(e => e.isCorrectChoice || e.wasSelected)

  if (entries.length === 0) return null

  return (
    <div className="mt-3 space-y-2">
      {entries.map(({ i, text, isCorrectChoice, wasSelected }) => (
        <div
          key={i}
          className={`rounded-lg px-3 py-2.5 border text-xs leading-relaxed ${
            isCorrectChoice
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <span className={`font-semibold mr-1.5 ${isCorrectChoice ? 'text-green-700' : 'text-red-600'}`}>
            {CHOICE_LABELS[i]}{isCorrectChoice ? ' (correct)' : ' (your pick)'}:
          </span>
          {text}
        </div>
      ))}
    </div>
  )
}

export default function ReviewCard({ question, userAnswer, questionNumber }) {
  const isEmpty = isAnswerEmpty(userAnswer, question)
  const isCorrect = !isEmpty && isAnswerCorrect(userAnswer, question)

  return (
    <div className={`bg-white rounded-xl border-2 p-6 ${
      isEmpty ? 'border-gray-200' : isCorrect ? 'border-green-200' : 'border-red-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-400">Q{questionNumber}</span>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {question.subtopic}
          </span>
          <span className="text-xs text-gray-400">{question.difficulty}</span>
          {TYPE_LABEL[question.type] && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
              {TYPE_LABEL[question.type]}
            </span>
          )}
          {question.type === 'multi_part' && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
              {question.parts?.length ?? 0}-Part
            </span>
          )}
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
          isEmpty
            ? 'bg-gray-100 text-gray-500'
            : isCorrect
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {isEmpty ? 'Not answered' : isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </span>
      </div>

      <VisualQuestionContext question={question} />

      <p className="text-sm font-medium text-gray-900 leading-relaxed mb-4">
        {question.question}
      </p>

      <QuestionRenderer
        question={question}
        answer={userAnswer}
        onAnswer={() => {}}
        isReviewMode={true}
      />

      {/* Main explanation — multi_part shows per-part explanations inline */}
      {question.type !== 'multi_part' && question.explanation && (
        <div className="mt-5 bg-gray-50 rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Explanation: </span>
            {question.explanation}
          </p>
          <ChoiceExplanations question={question} userAnswer={userAnswer} />
        </div>
      )}
    </div>
  )
}
