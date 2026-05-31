export default function FilteredTableSlide({ slide }) {
  const highlighted = new Set(slide.highlightRows || [])
  const dimmed = new Set(slide.dimRows || [])

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">{slide.title}</h3>
      {slide.filterNote && (
        <div className="text-xs font-mono text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-2">
          Filter: {slide.filterNote}
        </div>
      )}
      {slide.caption && <p className="text-xs text-gray-400 mb-2">{slide.caption}</p>}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {slide.headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">
                  {h}
                </th>
              ))}
              <th className="w-6 border-b border-gray-200" />
            </tr>
          </thead>
          <tbody>
            {slide.rows.map((row, ri) => (
              <tr
                key={ri}
                className={
                  highlighted.has(ri)
                    ? 'bg-green-50'
                    : dimmed.has(ri)
                    ? 'bg-gray-50'
                    : 'bg-white'
                }
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2 border-b border-gray-100 ${
                      highlighted.has(ri)
                        ? 'text-green-900 font-medium'
                        : dimmed.has(ri)
                        ? 'text-gray-300 line-through'
                        : 'text-gray-700'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
                <td className="px-2 py-2 border-b border-gray-100 text-center">
                  {highlighted.has(ri) && <span className="text-green-500 font-bold text-sm">✓</span>}
                  {dimmed.has(ri) && <span className="text-gray-300 text-sm">✗</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
