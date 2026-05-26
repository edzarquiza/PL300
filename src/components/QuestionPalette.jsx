import { isAnswerEmpty } from '../utils/answerUtils'

export default function QuestionPalette({ questions, answers, flagged, currentIndex, onSelect }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Question Navigator
      </p>

      <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
        {questions.map((q, i) => {
          const isAnswered = !isAnswerEmpty(answers[q.id], q)
          const isFlagged = !!flagged[q.id]
          const isCurrent = i === currentIndex
          const isCS = !!q.caseStudyId

          let classes = isCS ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          if (isAnswered) classes = 'bg-green-500 text-white hover:bg-green-600'
          if (isFlagged) classes = 'bg-amber-400 text-white hover:bg-amber-500'
          if (isCurrent) classes = 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1'

          return (
            <button
              key={q.id}
              onClick={() => onSelect(i)}
              title={`Question ${i + 1}${isCS ? ' · Case Study' : ''}${isFlagged ? ' · Flagged' : ''}`}
              className={`aspect-square rounded text-xs font-semibold transition-all ${classes}`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-5 mt-3 flex-wrap">
        <LegendItem color="bg-green-500" label="Answered" />
        <LegendItem color="bg-amber-400" label="Flagged" />
        <LegendItem color="bg-gray-200" label="Unanswered" />
        <LegendItem color="bg-blue-600" label="Current" />
        <LegendItem color="bg-indigo-200" label="Case Study" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      <span className={`w-2.5 h-2.5 rounded-sm inline-block ${color}`} />
      {label}
    </span>
  )
}
