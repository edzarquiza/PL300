// Unified answer operations for all question types.
// Single source of truth used by: ExamContext, examUtils, QuestionPalette,
// StudyFeedback, ReviewCard, and every question-type renderer.

export function isAnswerEmpty(answer, question) {
  if (answer === undefined || answer === null) return true

  switch (question?.type) {
    case 'multiple':
      return Array.isArray(answer) && answer.length === 0

    case 'true_false':
      // boolean false is a valid answer — only undefined/null are empty
      return answer !== true && answer !== false

    case 'drag_drop':
      // Answered only when every prompt slot has a mapping
      if (typeof answer !== 'object' || Array.isArray(answer)) return true
      return Object.keys(answer).length < (question.prompts?.length ?? 0)

    case 'rearrange_steps':
      // Answered when the user has made at least one reorder move
      return !Array.isArray(answer) || answer.length === 0

    case 'multi_part':
      // Answered when every part has a selection
      if (typeof answer !== 'object' || Array.isArray(answer)) return true
      return Object.values(answer).filter(v => v !== null && v !== undefined).length <
        (question.parts?.length ?? 0)

    default:
      // 'single': null already caught above; 0 is a valid index
      return false
  }
}

export function isAnswerCorrect(answer, question) {
  if (isAnswerEmpty(answer, question)) return false

  switch (question?.type) {
    case 'single':
      return answer === question.correctAnswers[0]

    case 'multiple': {
      const a = [...answer].sort((x, y) => x - y)
      const b = [...question.correctAnswers].sort((x, y) => x - y)
      return a.length === b.length && a.every((v, i) => v === b[i])
    }

    case 'true_false':
      return answer === question.correctAnswer

    case 'drag_drop': {
      const correct = question.correctMapping ?? {}
      return (
        Object.keys(correct).length === Object.keys(answer).length &&
        Object.keys(correct).every(k => answer[k] === correct[k])
      )
    }

    case 'rearrange_steps':
      return (
        answer.length === question.correctOrder.length &&
        answer.every((step, i) => step === question.correctOrder[i])
      )

    case 'multi_part':
      return question.parts.every((part, i) => {
        const partAnswer = answer[String(i)]
        if (partAnswer === undefined || partAnswer === null) return false
        return partAnswer === part.correctAnswers[0]
      })

    default:
      return false
  }
}
