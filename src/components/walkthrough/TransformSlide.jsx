function MiniTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-2 py-1.5 font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-1.5 text-gray-700 border-b border-gray-100">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TransformSlide({ slide }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{slide.title}</h3>
      <div>
        <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1.5">Before</p>
        <MiniTable headers={slide.before.headers} rows={slide.before.rows} />
      </div>
      <div className="flex items-center justify-center py-2.5">
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
          <span>⬇</span>
          <span className="font-semibold">{slide.stepName}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1.5">After</p>
        <MiniTable headers={slide.after.headers} rows={slide.after.rows} />
      </div>
      {slide.note && <p className="text-xs text-gray-500 mt-2.5 italic">{slide.note}</p>}
    </div>
  )
}
