// Strips checkmark/cross annotations (e.g. "9,800 ✅ (latest balance)") that
// would otherwise point straight at the correct answer in Exam Mode.
function stripAnswerMarkers(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/\s*←\s*answer\b/gi, '')
    .replace(/\s*[✅❌]\s*(\([^)]*\))?\s*(answer\b)?/gi, '')
    .trim()
}

export default function ResultTable({ output, revealAnswers = false }) {
  const label = output.label || 'Result'
  return (
    <div className="rounded-lg border border-green-200 overflow-hidden text-xs">
      <div className="bg-green-50 px-3 py-1.5 border-b border-green-200">
        <span className="font-semibold text-green-700">{label}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-green-100 bg-green-50">
              {output.columns.map(col => (
                <th key={col} className="px-3 py-1.5 text-left font-semibold text-gray-600 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1.5 text-gray-700 whitespace-nowrap font-medium">
                    {cell === null || cell === undefined
                      ? <span className="text-gray-300 italic">null</span>
                      : revealAnswers ? String(cell) : stripAnswerMarkers(String(cell))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
