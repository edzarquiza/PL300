// Distractor Coverage Engine
// Verifies that every answer choice that appears as a distractor in one question
// is also the correct answer somewhere in the question bank.
// Generates coverage reports and gap recommendations.

import { extractConcepts } from './conceptExposureService'

export function analyzeDistractorCoverage(allQuestions) {
  const correctConcepts = new Set()
  const distractorConcepts = new Set()
  const conceptQuestionMap = {}

  for (const q of allQuestions) {
    if (!q.choices || !q.correctAnswers) continue

    for (let i = 0; i < q.choices.length; i++) {
      const choice = q.choices[i]
      const concepts = extractConcepts(choice)
      const isCorrect = q.correctAnswers.includes(i)

      for (const concept of concepts) {
        if (isCorrect) {
          correctConcepts.add(concept)
          if (!conceptQuestionMap[concept]) conceptQuestionMap[concept] = { correct: [], distractor: [] }
          conceptQuestionMap[concept].correct.push(q.id)
        } else {
          distractorConcepts.add(concept)
          if (!conceptQuestionMap[concept]) conceptQuestionMap[concept] = { correct: [], distractor: [] }
          conceptQuestionMap[concept].distractor.push(q.id)
        }
      }
    }
  }

  const covered = []
  const missing = []

  for (const concept of distractorConcepts) {
    const data = conceptQuestionMap[concept]
    if (data && data.correct.length > 0) {
      covered.push({
        concept,
        correctInQuestions: data.correct.length,
        distractorInQuestions: data.distractor.length,
        linkedQuestionIds: [...new Set([...data.correct, ...data.distractor])],
      })
    } else {
      missing.push({
        concept,
        distractorInQuestions: data ? data.distractor.length : 0,
        recommendation: `Create a question where ${concept} is the correct answer.`,
      })
    }
  }

  covered.sort((a, b) => b.distractorInQuestions - a.distractorInQuestions)
  missing.sort((a, b) => b.distractorInQuestions - a.distractorInQuestions)

  return {
    totalDistractorConcepts: distractorConcepts.size,
    totalCorrectConcepts: correctConcepts.size,
    coveredCount: covered.length,
    missingCount: missing.length,
    coveragePct: distractorConcepts.size > 0
      ? Math.round(covered.length / distractorConcepts.size * 100)
      : 100,
    covered,
    missing,
  }
}

export function getConceptLinks(questionId, allQuestions) {
  const question = allQuestions.find(q => q.id === questionId)
  if (!question) return []

  const links = []
  for (let i = 0; i < question.choices.length; i++) {
    const choice = question.choices[i]
    const isCorrect = question.correctAnswers.includes(i)
    const concepts = extractConcepts(choice)

    for (const concept of concepts) {
      const linkedQuestions = allQuestions.filter(q =>
        q.id !== questionId && q.correctAnswers?.some(ci =>
          extractConcepts(q.choices[ci]).includes(concept)
        )
      )

      if (linkedQuestions.length > 0) {
        links.push({
          concept,
          choiceIndex: i,
          isCorrectHere: isCorrect,
          correctElsewhere: linkedQuestions.map(q => q.id),
        })
      }
    }
  }

  return links
}
