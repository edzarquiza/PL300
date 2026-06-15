import { stripAnswerMarkers } from '../utils/textUtils'

export default function SampleDataTable({ table, revealAnswers = false }) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden text-xs">
      <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-200 flex items-center gap-2">
        <span className="font-semibold text-gray-700">{table.name}</span>
        <span className="text-gray-400">{table.rows.length} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {table.columns.map(col => (
                <th key={col} className="px-3 py-1.5 text-left font-semibold text-gray-600 whitespace-nowrap">
                  {revealAnswers ? col : stripAnswerMarkers(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1.5 text-gray-700 whitespace-nowrap">
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
