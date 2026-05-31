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

export default function RlsSlide({ slide }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">{slide.title}</h3>

      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {(slide.user || 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-900">{slide.user}</p>
          <p className="text-xs text-blue-600">Role: <span className="font-medium">{slide.role}</span></p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg px-3 py-2.5">
        <p className="text-xs font-semibold text-gray-400 mb-1">RLS Filter (DAX)</p>
        <code className="text-xs font-mono text-green-400 break-all">{slide.filter}</code>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">All Data</p>
          <MiniTable headers={slide.allRows.headers} rows={slide.allRows.rows} />
        </div>
        <div>
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1.5">User Sees</p>
          <MiniTable headers={slide.visibleRows.headers} rows={slide.visibleRows.rows} />
        </div>
      </div>

      {slide.note && (
        <p className="text-xs text-gray-500 italic leading-relaxed">{slide.note}</p>
      )}
    </div>
  )
}
