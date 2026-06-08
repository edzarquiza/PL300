import QuestionRenderer from './question-types/QuestionRenderer'
import VisualQuestionContext from './VisualQuestionContext'
import CaseStudyContext from './CaseStudyContext'
import VisualChoicePreviews from './charts/VisualChoicePreviews'

const TYPE_BADGE = {
  multi:           { label: 'Select all that apply', color: 'amber' },
  true_false:      { label: 'True or False',         color: 'amber' },
  drag_drop:       { label: 'Drag & Drop',            color: 'amber' },
  rearrange_steps: { label: 'Arrange in Order',       color: 'amber' },
  multi_part:      null, // badge shown per-part inside MultiPartQuestion
}

export default function QuestionCard({ question, selectedAnswer, onSelectAnswer }) {
  const badge = TYPE_BADGE[question.type]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-5 sm:p-8">
      <CaseStudyContext context={question.caseStudyContext ?? null} />

      {/* Metadata row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          {question.subtopic}
        </span>
        <span className="text-xs font-medium text-gray-400">{question.difficulty}</span>
        {badge && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            badge.color === 'purple' ? 'text-purple-600 bg-purple-50' : 'text-amber-600 bg-amber-50'
          }`}>
            {badge.label}
          </span>
        )}
        {question.type === 'multi_part' && (
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
            {question.parts?.length ?? 0}-Part Question
          </span>
        )}
      </div>

      <VisualQuestionContext question={question} />
      <VisualChoicePreviews question={question} />

      <p className="text-base font-medium text-gray-900 leading-relaxed mt-4 mb-7">
        {question.question}
      </p>

      <QuestionRenderer
        question={question}
        answer={selectedAnswer}
        onAnswer={onSelectAnswer}
        isReviewMode={false}
      />
    </div>
  )
}
