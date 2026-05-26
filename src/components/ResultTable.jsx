export default function ResultTable({ output }) {
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
                      : String(cell)}
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
