import SampleDataTable from './SampleDataTable'

export default function TransformationPreview({ preview }) {
  return (
    <div>
      {preview.label && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {preview.label}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-start">
        <div>
          <p className="text-xs text-gray-400 mb-1.5 font-medium">Before</p>
          <SampleDataTable table={preview.before} />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1.5 font-medium">After →</p>
          <SampleDataTable table={preview.after} />
        </div>
      </div>
    </div>
  )
}
