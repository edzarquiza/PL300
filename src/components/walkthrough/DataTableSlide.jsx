export default function DataTableSlide({ slide }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-1">{slide.title}</h3>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {slide.note && <p className="text-xs text-gray-500 mt-2 italic">{slide.note}</p>}
    </div>
  )
}
