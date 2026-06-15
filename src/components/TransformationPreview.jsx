import SampleDataTable from './SampleDataTable'

// In exam mode, the table names and label often describe the correct
// transformation (e.g. "After Fill Down"), which gives away the answer.
// Outside study/review mode we show generic "Before"/"After" labels instead.
export default function TransformationPreview({ preview, revealAnswers = false }) {
  const beforeTable = revealAnswers ? preview.before : { ...preview.before, name: 'Before' }
  const afterTable  = revealAnswers ? preview.after  : { ...preview.after,  name: 'After' }

  return (
    <div>
      {revealAnswers && preview.label && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {preview.label}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-start">
        <div>
          <p className="text-xs text-gray-400 mb-1.5 font-medium">Before</p>
          <SampleDataTable table={beforeTable} revealAnswers={revealAnswers} />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1.5 font-medium">After →</p>
          <SampleDataTable table={afterTable} revealAnswers={revealAnswers} />
        </div>
      </div>
    </div>
  )
}
