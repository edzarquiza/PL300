const TYPE_STYLE = {
  fact:      { badge: 'bg-blue-100 text-blue-700',  border: 'border-blue-200' },
  dimension: { badge: 'bg-gray-100 text-gray-600',  border: 'border-gray-200' },
}

const CARDINALITY_LABEL = {
  'many-to-one':  'M : 1',
  'one-to-many':  '1 : M',
  'many-to-many': 'M : M',
  'one-to-one':   '1 : 1',
}

const DIRECTION_LABEL = {
  single: '→',
  both:   '↔',
  Both:   '↔',
  Single: '→',
}

export default function RelationshipDiagram({ diagram }) {
  if (!diagram) return null
  const { tables = [], relationships = [], issue } = diagram

  return (
    <div className="space-y-4">
      {/* Tables grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tables.map(table => {
          const s = TYPE_STYLE[table.type] ?? TYPE_STYLE.dimension
          return (
            <div
              key={table.name}
              className={`rounded-lg border ${s.border} bg-white p-2.5`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-bold text-gray-800 truncate">{table.name}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${s.badge}`}>
                  {table.type ?? 'table'}
                </span>
              </div>
              {table.keyColumns?.length > 0 && (
                <div className="border-b border-dashed border-gray-200 pb-1.5 mb-1.5">
                  {table.keyColumns.map(col => (
                    <p key={col} className="text-xs text-gray-500 font-mono flex items-center gap-1">
                      <span className="text-amber-500 text-xs">🔑</span>{col}
                    </p>
                  ))}
                </div>
              )}
              {table.columns?.slice(0, 4).map(col => (
                <p key={col} className="text-xs text-gray-400 font-mono truncate">{col}</p>
              ))}
              {(table.columns?.length ?? 0) > 4 && (
                <p className="text-xs text-gray-300 mt-0.5">+{table.columns.length - 4} more</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Relationships */}
      {relationships.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Relationships</p>
          {relationships.map((rel, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                rel.active === false
                  ? 'bg-gray-50 border border-dashed border-gray-200'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <span className="font-mono font-semibold text-gray-700">{rel.from}</span>
              <span className="text-gray-400 font-mono text-xs flex-shrink-0">
                [{rel.fromKey}]
              </span>
              <span className="flex items-center gap-1 text-blue-500 font-bold flex-shrink-0">
                <span>{CARDINALITY_LABEL[rel.cardinality] ?? rel.cardinality}</span>
                <span className="text-gray-500">{DIRECTION_LABEL[rel.direction] ?? '→'}</span>
              </span>
              <span className="font-mono font-semibold text-gray-700">{rel.to}</span>
              <span className="text-gray-400 font-mono text-xs flex-shrink-0">
                [{rel.toKey}]
              </span>
              {rel.active === false && (
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                  inactive
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Issue callout */}
      {issue && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Note: </span>{issue}
          </p>
        </div>
      )}
    </div>
  )
}
