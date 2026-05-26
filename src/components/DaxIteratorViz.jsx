export default function DaxIteratorViz({ flow }) {
  const calcColIndex = flow.columns.length - 2
  const resultColIndex = flow.columns.length - 1

  return (
    <div className="rounded-lg border border-purple-200 overflow-hidden text-xs">
      <div className="bg-purple-50 px-3 py-1.5 border-b border-purple-200">
        <span className="font-semibold text-purple-700">Iterator Row Evaluation</span>
        <span className="ml-2 text-purple-500 font-normal">— evaluated once per row, then aggregated</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50 border-b border-purple-100">
              {flow.columns.map((col, i) => (
                <th
                  key={col}
                  className={`px-3 py-2 text-left font-semibold whitespace-nowrap ${
                    i === calcColIndex
                      ? 'text-amber-700'
                      : i === resultColIndex
                      ? 'text-green-700'
                      : 'text-purple-700'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flow.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100 last:border-0">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2 whitespace-nowrap ${
                      ci === calcColIndex
                        ? 'font-mono text-amber-700 bg-amber-50'
                        : ci === resultColIndex
                        ? 'font-semibold text-green-700 bg-green-50'
                        : 'text-gray-700'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-green-50 border-t border-green-100 px-3 py-2 flex items-center justify-between">
        <span className="text-gray-500 italic">{flow.finalOperation}</span>
        <span className="font-bold text-green-800 text-sm">{flow.finalResult}</span>
      </div>
    </div>
  )
}
