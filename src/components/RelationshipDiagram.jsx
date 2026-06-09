import { useRef, useLayoutEffect, useState, useCallback } from 'react'

const CARD_LABEL = {
  'one-to-many': '1:M', 'many-to-one': 'M:1',
  'many-to-many': 'M:M', 'one-to-one': '1:1',
}

function boxClass(table) {
  if (table.highlight === 'filter-source') return 'border-amber-400 bg-amber-50'
  if (table.highlight === 'filter-target') return 'border-blue-500 bg-blue-50'
  if (table.highlight === 'blocked') return 'border-red-300 bg-red-50'
  if (table.type === 'fact') return 'border-blue-200 bg-blue-50'
  return 'border-gray-200 bg-white'
}

function badgeClass(table) {
  if (table.type === 'fact') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-500'
}

function highlightLabel(table) {
  if (table.highlight === 'filter-source') return 'text-amber-600'
  if (table.highlight === 'filter-target') return 'text-blue-600'
  if (table.highlight === 'blocked') return 'text-red-500'
  return null
}

function TableBox({ table, tableRefs }) {
  const hl = highlightLabel(table)
  return (
    <div
      ref={el => { if (el) tableRefs.current[table.name] = el }}
      className={`rounded-lg border-2 p-2.5 w-36 flex-shrink-0 ${boxClass(table)}`}
    >
      <div className="flex items-start gap-1 mb-1.5">
        <span className="text-xs font-bold text-gray-800 leading-tight flex-1 min-w-0 break-words">
          {table.name}
        </span>
        <span className={`text-[9px] font-semibold px-1 py-0.5 rounded flex-shrink-0 mt-0.5 ${badgeClass(table)}`}>
          {table.type}
        </span>
      </div>
      {(table.keyColumns || []).map(c => (
        <p key={c} className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5 border-b border-dashed border-gray-200 pb-0.5 mb-0.5">
          🔑 {c}
        </p>
      ))}
      {(table.columns || []).slice(0, 3).map(c => (
        <p key={c} className="text-[10px] text-gray-400 font-mono truncate">{c}</p>
      ))}
      {(table.columns?.length ?? 0) > 3 && (
        <p className="text-[10px] text-gray-300 font-mono">+{table.columns.length - 3}</p>
      )}
      {hl && (
        <p className={`mt-1 text-[9px] font-semibold uppercase tracking-wide ${hl}`}>
          {table.highlight === 'filter-source' ? 'Filter Source' : table.highlight === 'filter-target' ? 'Filtered' : 'Blocked'}
        </p>
      )}
    </div>
  )
}

function arrowStyle(rel) {
  if (rel.active === false) return { stroke: '#D1D5DB', text: '#9CA3AF', dash: '4,3', w: 1.5, end: 'url(#rd-i)', rev: 'url(#rd-i-rev)' }
  if (rel.highlight) return { stroke: '#22C55E', text: '#16A34A', dash: null, w: 2.5, end: 'url(#rd-a)', rev: 'url(#rd-a-rev)' }
  return { stroke: '#CBD5E1', text: '#94A3B8', dash: null, w: 1.5, end: 'url(#rd-n)', rev: 'url(#rd-n-rev)' }
}

export default function RelationshipDiagram({ diagram }) {
  if (!diagram) return null
  const { tables = [], relationships = [], filterNote, issue } = diagram

  const containerRef = useRef(null)
  const tableRefs = useRef({})
  const [arrows, setArrows] = useState([])
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 })

  const tableMap = Object.fromEntries(tables.map(t => [t.name, t]))
  const left = tables.filter(t => t.position === 'left')
  const center = tables.filter(t => t.position === 'center' || (!t.position && t.type === 'fact'))
  const right = tables.filter(t => t.position === 'right')

  const recompute = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const newArrows = []

    for (const rel of relationships) {
      const fromT = tableMap[rel.from]
      const toT = tableMap[rel.to]
      if (!fromT || !toT) continue
      const fromEl = tableRefs.current[rel.from]
      const toEl = tableRefs.current[rel.to]
      if (!fromEl || !toEl) continue

      const fr = fromEl.getBoundingClientRect()
      const tr = toEl.getBoundingClientRect()
      const fromPos = fromT.position ?? (fromT.type === 'fact' ? 'center' : 'left')
      const offset = rel.arrowOffset ?? 0

      let x1, x2
      if (fromPos === 'left') {
        x1 = fr.right - cRect.left
        x2 = tr.left - cRect.left
      } else if (fromPos === 'right') {
        x1 = fr.left - cRect.left
        x2 = tr.right - cRect.left
      } else {
        x1 = fr.right - cRect.left
        x2 = tr.left - cRect.left
      }

      const y1 = (fr.top + fr.bottom) / 2 - cRect.top + offset
      const y2 = (tr.top + tr.bottom) / 2 - cRect.top + offset

      newArrows.push({ ...rel, x1, y1, x2, y2 })
    }

    setArrows(newArrows)
    setSvgDims({ w: cRect.width, h: cRect.height })
  }, [diagram])

  useLayoutEffect(() => {
    recompute()
    const ro = new ResizeObserver(recompute)
    const el = containerRef.current
    if (el) ro.observe(el)
    return () => ro.disconnect()
  }, [recompute])

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative flex items-center justify-center gap-20 py-4 min-h-[100px]"
      >
        {left.length > 0 && (
          <div className="flex flex-col gap-3.5 flex-shrink-0">
            {left.map(t => <TableBox key={t.name} table={t} tableRefs={tableRefs} />)}
          </div>
        )}
        {center.length > 0 && (
          <div className="flex flex-col gap-3.5 flex-shrink-0">
            {center.map(t => <TableBox key={t.name} table={t} tableRefs={tableRefs} />)}
          </div>
        )}
        {right.length > 0 && (
          <div className="flex flex-col gap-3.5 flex-shrink-0">
            {right.map(t => <TableBox key={t.name} table={t} tableRefs={tableRefs} />)}
          </div>
        )}

        <svg
          className="absolute inset-0 pointer-events-none"
          width={svgDims.w}
          height={svgDims.h}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Normal gray */}
            <marker id="rd-n" markerWidth="9" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <path d="M0,0 L9,3.5 L0,7 Z" fill="#CBD5E1" />
            </marker>
            <marker id="rd-n-rev" markerWidth="9" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <path d="M9,0 L0,3.5 L9,7 Z" fill="#CBD5E1" />
            </marker>
            {/* Active green */}
            <marker id="rd-a" markerWidth="9" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <path d="M0,0 L9,3.5 L0,7 Z" fill="#22C55E" />
            </marker>
            <marker id="rd-a-rev" markerWidth="9" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <path d="M9,0 L0,3.5 L9,7 Z" fill="#22C55E" />
            </marker>
            {/* Inactive light gray */}
            <marker id="rd-i" markerWidth="9" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <path d="M0,0 L9,3.5 L0,7 Z" fill="#E5E7EB" />
            </marker>
            <marker id="rd-i-rev" markerWidth="9" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <path d="M9,0 L0,3.5 L9,7 Z" fill="#E5E7EB" />
            </marker>
          </defs>

          {arrows.map((arr, i) => {
            const s = arrowStyle(arr)
            const mx = (arr.x1 + arr.x2) / 2
            const lx = mx
            const ly = (arr.y1 + arr.y2) / 2 - 9
            const isBidir = arr.direction === 'both' || arr.direction === 'Both'
            const label = arr.label ?? CARD_LABEL[arr.cardinality] ?? arr.cardinality

            return (
              <g key={i}>
                <path
                  d={`M ${arr.x1},${arr.y1} C ${mx},${arr.y1} ${mx},${arr.y2} ${arr.x2},${arr.y2}`}
                  fill="none"
                  stroke={s.stroke}
                  strokeWidth={s.w}
                  strokeDasharray={s.dash ?? undefined}
                  markerEnd={s.end}
                  markerStart={isBidir ? s.rev : undefined}
                />
                {label && (
                  <text x={lx} y={ly} textAnchor="middle" fontSize="9"
                    fill={s.text} fontFamily="ui-monospace,monospace"
                    fontWeight={arr.highlight ? '700' : '400'}>
                    {label}
                  </text>
                )}
                {arr.active === false && (
                  <text x={lx} y={ly + 11} textAnchor="middle" fontSize="8"
                    fill="#9CA3AF" fontStyle="italic" fontFamily="system-ui,sans-serif">
                    inactive
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {filterNote && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="text-green-500 flex-shrink-0 mt-0.5 text-xs">▶</span>
          <p className="text-xs text-green-700 leading-snug">
            <span className="font-semibold">Filter path: </span>{filterNote}
          </p>
        </div>
      )}

      {issue && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-700 leading-snug">
            <span className="font-semibold">⚠ Note: </span>{issue}
          </p>
        </div>
      )}
    </div>
  )
}
