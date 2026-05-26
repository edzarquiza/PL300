import allQuestions from '../data/questions.json'
import caseStudies from '../data/caseStudies.json'

const csQuestions = caseStudies.flatMap(cs => cs.questions)
const _map = Object.fromEntries(
  [...allQuestions, ...csQuestions].map(q => [String(q.id), q])
)

export function lookupQuestion(id) {
  return _map[String(id)] ?? null
}
