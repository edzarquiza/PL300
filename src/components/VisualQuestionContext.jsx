import SampleDataTable from './SampleDataTable'
import DaxExpressionBlock from './DaxExpressionBlock'
import ResultTable from './ResultTable'
import TransformationPreview from './TransformationPreview'
import RelationshipDiagram from './RelationshipDiagram'

// Matches a DAX function call like "SUMX(" or "CALCULATE(" — used to detect
// "which expression is correct?" questions where every choice is itself a
// candidate formula. For these, daxExpression/expectedOutput/transformationPreview
// usually demonstrate the CORRECT formula and would leak the answer in Exam Mode.
const DAX_FN_PATTERN = /\b[A-Z][A-Z0-9_]{2,}\s*\(/

function isFormulaChoiceQuestion(question) {
  const choices = question.choices
  if (!Array.isArray(choices) || choices.length < 2) return false
  if (question.type !== 'single' && question.type !== 'multi') return false
  const formulaCount = choices.filter(c => DAX_FN_PATTERN.test(c)).length
  return formulaCount >= choices.length - 1
}

export default function VisualQuestionContext({ question, revealAnswers = false }) {
  const { sampleData, daxExpression, expectedOutput, transformationPreview, visualContext } = question

  const hideAnswerRevealingRefs = !revealAnswers
    && (isFormulaChoiceQuestion(question) || question.daxExpressionRevealsAnswer === true)

  // Tables whose contents directly give away the correct choice (flagged with
  // revealsAnswer) are hidden until Study Mode/Review reveals answers.
  const visibleTables = (sampleData?.tables ?? []).filter(table => revealAnswers || !table.revealsAnswer)

  const showSampleData  = visibleTables.length > 0
  const showDax         = daxExpression && !hideAnswerRevealingRefs
  const showTransform   = transformationPreview && !hideAnswerRevealingRefs
  const showExpected    = expectedOutput && !hideAnswerRevealingRefs && (revealAnswers || !expectedOutput.revealsAnswer)
  const showDiagram     = !!visualContext?.relationshipDiagram

  const hasVisuals = showSampleData || showDax || showTransform || showExpected || showDiagram
  if (!hasVisuals) return null

  return (
    <div className="mb-5 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Reference Data</p>

      {visibleTables.map(table => (
        <SampleDataTable key={table.name} table={table} revealAnswers={revealAnswers} />
      ))}

      {showDax && (
        <DaxExpressionBlock expression={daxExpression} />
      )}

      {showTransform && (
        <TransformationPreview preview={transformationPreview} revealAnswers={revealAnswers} />
      )}

      {showExpected && (
        <ResultTable output={expectedOutput} revealAnswers={revealAnswers} />
      )}

      {showDiagram && (
        <RelationshipDiagram diagram={visualContext.relationshipDiagram} />
      )}
    </div>
  )
}
