export default function IteratorSlide({ slide }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">{slide.title}</h3>
      {slide.caption && <p className="text-xs text-gray-400 mb-2">{slide.caption}</p>}
      <div className="bg-gray-900 rounded-lg px-3 py-2.5 mb-3">
        <p className="text-xs font-mono text-amber-300 leading-relaxed">{slide.formula}</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 mb-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {slide.headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">
                  {h}
                </th>
              ))}
              <th className="text-left px-3 py-2 font-semibold text-indigo-700 border-b border-gray-200 bg-indigo-50 whitespace-nowrap">
                {slide.resultHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {slide.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-gray-700 border-b border-gray-100">
                    {cell}
                  </td>
                ))}
                <td className="px-3 py-2 text-indigo-700 font-bold border-b border-gray-100 bg-indigo-50/50">
                  {slide.results[ri]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-gray-500">Total sum:</span>
        <span className="text-2xl font-bold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-200">
          {slide.total}
        </span>
      </div>
    </div>
  )
}
