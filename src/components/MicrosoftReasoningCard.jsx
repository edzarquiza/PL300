import { getMicrosoftReasoning } from '../services/microsoftReasoningService'

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E']

function ReasonSection({ icon, label, text, colorScheme }) {
  const schemes = {
    blue:   { bg: 'bg-blue-50',   border: 'border-blue-100', label: 'text-blue-700',  text: 'text-blue-900',  icon: 'text-blue-500'  },
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-100',label: 'text-amber-700', text: 'text-amber-900', icon: 'text-amber-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100',label: 'text-purple-700',text: 'text-purple-900',icon: 'text-purple-500'},
    green:  { bg: 'bg-green-50',  border: 'border-green-100', label: 'text-green-700', text: 'text-green-900', icon: 'text-green-600' },
    teal:   { bg: 'bg-teal-50',   border: 'border-teal-100',  label: 'text-teal-700',  text: 'text-teal-900',  icon: 'text-teal-500'  },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200',label: 'text-yellow-800',text: 'text-yellow-900',icon: 'text-yellow-600'},
  }
  const s = schemes[colorScheme] ?? schemes.blue

  return (
    <div className={`rounded-lg border ${s.bg} ${s.border} px-3.5 py-3`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5 ${s.label}`}>
        <span className={s.icon}>{icon}</span>
        {label}
      </p>
      <p className={`text-xs leading-relaxed ${s.text}`}>{text}</p>
    </div>
  )
}

function WrongChoiceRow({ idx, choiceText, reasoning }) {
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <div className="flex items-start gap-2.5 px-3 py-2 bg-gray-50">
        <span className="flex-shrink-0 text-xs font-bold text-gray-500 mt-0.5">{CHOICE_LABELS[idx]}.</span>
        <span className="text-xs text-gray-700 leading-snug flex-1">{choiceText}</span>
        <span className="flex-shrink-0 text-xs text-red-500 font-semibold whitespace-nowrap">✗ loses</span>
      </div>
      {reasoning && (
        <p className="px-3 py-2 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
          {reasoning}
        </p>
      )}
    </div>
  )
}

export default function MicrosoftReasoningCard({ question }) {
  const r = getMicrosoftReasoning(question)
  if (!r) return null

  const wrongChoices = (question.choices || [])
    .map((text, i) => ({ i, text }))
    .filter(({ i }) => !(question.correctAnswers ?? []).includes(i))

  const hasLosers = wrongChoices.some(({ i }) => r.whyOthersLose?.[String(i)])

  return (
    <div className="space-y-3">

      {/* Why It Wins */}
      {r.whyItWins && (
        <ReasonSection
          icon="✓"
          label="Why It Wins"
          text={r.whyItWins}
          colorScheme="blue"
        />
      )}

      {/* Why Other Answers Lose */}
      {hasLosers && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-0.5">
            Why Other Answers Lose
          </p>
          {wrongChoices.map(({ i, text }) => {
            const reason = r.whyOthersLose?.[String(i)]
            return (
              <WrongChoiceRow
                key={i}
                idx={i}
                choiceText={text}
                reasoning={reason}
              />
            )
          })}
        </div>
      )}

      {/* Stakeholder Perspective */}
      {r.stakeholderPerspective && (
        <ReasonSection
          icon="👤"
          label="Stakeholder Perspective"
          text={r.stakeholderPerspective}
          colorScheme="purple"
        />
      )}

      {/* Performance Perspective */}
      {r.performancePerspective && (
        <ReasonSection
          icon="⚡"
          label="Performance Perspective"
          text={r.performancePerspective}
          colorScheme="green"
        />
      )}

      {/* Maintainability Perspective */}
      {r.maintainabilityPerspective && (
        <ReasonSection
          icon="🔧"
          label="Maintainability Perspective"
          text={r.maintainabilityPerspective}
          colorScheme="teal"
        />
      )}

      {/* Microsoft Exam Tip */}
      {r.examTip && (
        <ReasonSection
          icon="!"
          label="Microsoft Exam Tip"
          text={r.examTip}
          colorScheme="yellow"
        />
      )}
    </div>
  )
}
