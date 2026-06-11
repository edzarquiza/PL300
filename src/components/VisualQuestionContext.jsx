import SampleDataTable from './SampleDataTable'
import DaxExpressionBlock from './DaxExpressionBlock'
import ResultTable from './ResultTable'
import TransformationPreview from './TransformationPreview'
import RelationshipDiagram from './RelationshipDiagram'

export default function VisualQuestionContext({ question, revealAnswers = false }) {
  const { sampleData, daxExpression, expectedOutput, transformationPreview, visualContext } = question

  const hasVisuals = sampleData?.tables?.length > 0 || daxExpression || expectedOutput || transformationPreview || visualContext?.relationshipDiagram
  if (!hasVisuals) return null

  return (
    <div className="mb-5 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Reference Data</p>

      {sampleData?.tables?.map(table => (
        <SampleDataTable key={table.name} table={table} />
      ))}

      {daxExpression && (
        <DaxExpressionBlock expression={daxExpression} />
      )}

      {transformationPreview && (
        <TransformationPreview preview={transformationPreview} revealAnswers={revealAnswers} />
      )}

      {expectedOutput && (revealAnswers || !expectedOutput.revealsAnswer) && (
        <ResultTable output={expectedOutput} revealAnswers={revealAnswers} />
      )}

      {visualContext?.relationshipDiagram && (
        <RelationshipDiagram diagram={visualContext.relationshipDiagram} />
      )}
    </div>
  )
}
