// Renders the `visual` property from a concept reviewer card.
// Supports: flow | table | filtered-table | comparison | code | before-after

function FlowVisual({ v }) {
  return (
    <div className="rounded-lg border border-blue-100 overflow-hidden text-xs">
      <div className="bg-blue-50 px-3 py-1.5 border-b border-blue-100">
        <span className="font-semibold text-blue-700">{v.title || 'How It Works'}</span>
      </div>
      <div className="p-3 space-y-2">
        {v.steps.map((step, i) => {
          const isLast = i === v.steps.length - 1
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                isLast ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {i + 1}
              </span>
              <p className={`leading-snug pt-0.5 ${isLast ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                {step}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TableVisual({ v }) {
  return (
    <div>
      {v.title && <p className="text-xs font-semibold text-gray-500 mb-1.5">{v.title}</p>}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {v.headers.map((h, i) => (
                <th key={i} className="text-left px-2.5 py-1.5 font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {v.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-2.5 py-1.5 text-gray-700 border-b border-gray-100">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {v.note && <p className="text-xs text-gray-400 mt-1.5 italic">{v.note}</p>}
    </div>
  )
}

function FilteredTableVisual({ v }) {
  const hi = new Set(v.highlight || [])
  const dim = new Set(v.dim || [])
  return (
    <div>
      {v.filterNote && (
        <p className="text-xs font-mono text-blue-800 bg-blue-50 border border-blue-100 rounded px-2.5 py-1.5 mb-2">
          Filter: {v.filterNote}
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {v.headers.map((h, i) => (
                <th key={i} className="text-left px-2.5 py-1.5 font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">{h}</th>
              ))}
              <th className="w-5 border-b border-gray-200" />
            </tr>
          </thead>
          <tbody>
            {v.rows.map((row, ri) => (
              <tr key={ri} className={hi.has(ri) ? 'bg-green-50' : dim.has(ri) ? 'bg-gray-50' : 'bg-white'}>
                {row.map((cell, ci) => (
                  <td key={ci} className={`px-2.5 py-1.5 border-b border-gray-100 ${
                    hi.has(ri) ? 'text-green-900 font-medium' : dim.has(ri) ? 'text-gray-300 line-through' : 'text-gray-700'
                  }`}>{cell}</td>
                ))}
                <td className="px-1.5 py-1.5 border-b border-gray-100 text-center text-xs">
                  {hi.has(ri) && <span className="text-green-500 font-bold">✓</span>}
                  {dim.has(ri) && <span className="text-gray-300">✗</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ComparisonVisual({ v }) {
  const { left, right, winner } = v
  return (
    <div>
      {v.title && <p className="text-xs font-semibold text-gray-500 mb-2">{v.title}</p>}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[left, right].map((side, si) => {
          const isWinner = winner === (si === 0 ? 'left' : 'right')
          return (
            <div key={si} className={`rounded-lg border-2 p-2.5 ${isWinner ? 'border-green-400 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <p className={`font-semibold mb-1.5 ${isWinner ? 'text-green-800' : 'text-red-700'}`}>
                {isWinner ? '✓ ' : '✗ '}{side.label}
              </p>
              <ul className="space-y-1">
                {side.items.map((item, ii) => (
                  <li key={ii} className={`flex items-start gap-1 leading-snug ${isWinner ? 'text-green-900' : 'text-red-800'}`}>
                    <span className="flex-shrink-0 mt-0.5">{isWinner ? '•' : '–'}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CodeVisual({ v }) {
  const lang = v.language || 'dax'
  return (
    <div>
      <div className="bg-gray-900 rounded-lg px-3 py-3 overflow-x-auto">
        {lang === 'dax' && (
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">DAX</p>
        )}
        {lang === 'm' && (
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Power Query M</p>
        )}
        <pre className="text-xs font-mono text-green-400 leading-relaxed whitespace-pre-wrap break-words">
          {v.expression}
        </pre>
      </div>
      {v.result && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-400">Result:</span>
          <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">{v.result}</span>
        </div>
      )}
    </div>
  )
}

function BeforeAfterVisual({ v }) {
  return (
    <div>
      {v.title && <p className="text-xs font-semibold text-gray-500 mb-2">{v.title}</p>}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-red-200 bg-red-50 p-2.5">
          <p className="font-semibold text-red-700 mb-1.5">✗ {v.before.label}</p>
          <p className="text-red-900 leading-snug whitespace-pre-wrap">{v.before.content}</p>
        </div>
        <div className="rounded-lg border border-green-300 bg-green-50 p-2.5">
          <p className="font-semibold text-green-700 mb-1.5">✓ {v.after.label}</p>
          <p className="text-green-900 leading-snug whitespace-pre-wrap">{v.after.content}</p>
        </div>
      </div>
    </div>
  )
}

const RENDERERS = {
  flow: FlowVisual,
  table: TableVisual,
  'filtered-table': FilteredTableVisual,
  comparison: ComparisonVisual,
  code: CodeVisual,
  'before-after': BeforeAfterVisual,
}

export default function ConceptVisual({ visual }) {
  if (!visual?.type) return null
  const Renderer = RENDERERS[visual.type]
  if (!Renderer) return null
  return (
    <div className="mb-4">
      <Renderer v={visual} />
    </div>
  )
}
