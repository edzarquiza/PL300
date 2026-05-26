import caseStudies from '../data/caseStudies.json'

/**
 * Returns all case study sub-questions as flat question objects,
 * each enriched with a caseStudyContext property so QuestionCard
 * can render the shared scenario panel.
 */
export function getCaseStudyQuestions() {
  return caseStudies.flatMap(cs =>
    cs.questions.map(q => ({
      ...q,
      caseStudyContext: {
        id: cs.id,
        title: cs.title,
        scenario: cs.scenario,
        currentSetup: cs.currentSetup,
        requirements: cs.requirements,
      },
    }))
  )
}

/**
 * Returns case study metadata without sub-questions.
 */
export function getCaseStudyById(id) {
  return caseStudies.find(cs => cs.id === id) ?? null
}

/**
 * Returns all case studies.
 */
export function getAllCaseStudies() {
  return caseStudies
}
