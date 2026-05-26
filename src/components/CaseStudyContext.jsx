import { useState } from 'react'

export default function CaseStudyContext({ context }) {
  const [expanded, setExpanded] = useState(true)
  if (!context) return null

  return (
    <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Case Study
          </span>
          <span className="text-sm font-semibold text-blue-900">{context.title}</span>
        </div>
        <span className="text-blue-400 text-xs flex-shrink-0">
          {expanded ? '▲ Collapse' : '▼ Read scenario'}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-blue-200">
          {/* Scenario */}
          <div className="pt-3">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
              Background
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{context.scenario}</p>
          </div>

          {/* Current Setup */}
          {context.currentSetup && (
            <div>
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
                Current Setup
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{context.currentSetup}</p>
            </div>
          )}

          {/* Requirements */}
          {context.requirements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
                Business Requirements
              </p>
              <ol className="space-y-1">
                {context.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
