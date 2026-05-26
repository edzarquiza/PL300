import SingleChoiceQuestion from './SingleChoiceQuestion'
import MultiSelectQuestion from './MultiSelectQuestion'
import TrueFalseQuestion from './TrueFalseQuestion'
import DragDropQuestion from './DragDropQuestion'
import RearrangeStepsQuestion from './RearrangeStepsQuestion'
import MultiPartQuestion from './MultiPartQuestion'

// Thin dispatcher — no wrapper chrome. Callers (QuestionCard, ReviewCard) provide the outer card.
export default function QuestionRenderer({ question, answer, onAnswer, isReviewMode = false }) {
  const props = { question, answer, onAnswer, isReviewMode }

  switch (question.type) {
    case 'multiple':        return <MultiSelectQuestion {...props} />
    case 'true_false':      return <TrueFalseQuestion {...props} />
    case 'drag_drop':       return <DragDropQuestion {...props} />
    case 'rearrange_steps': return <RearrangeStepsQuestion {...props} />
    case 'multi_part':      return <MultiPartQuestion {...props} />
    default:                return <SingleChoiceQuestion {...props} />
  }
}
