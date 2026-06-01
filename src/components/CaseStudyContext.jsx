import { useState } from 'react'

function SolutionCard({ solution, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between px-4 py-3 text-left gap-3"
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center mt-0.5">
            {solution.requirementIndex + 1}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-0.5">Recommended Solution</p>
            <p className="text-sm font-semibold text-emerald-900 leading-snug">{solution.title}</p>
          </div>
        </div>
        <span className="text-emerald-500 text-xs flex-shrink-0 mt-1">{open ? '▲' : '▼ Show'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-emerald-200 space-y-4">

          {/* Overview */}
          <p className="text-sm text-gray-700 leading-relaxed pt-3">{solution.overview}</p>

          {/* Steps */}
          {solution.steps?.length > 0 && (
            <div className="space-y-3">
              {solution.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border-2 border-emerald-300 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 mb-1">{step.label}</p>
                    {step.detail.includes('\n') ? (
                      <pre className="text-xs text-gray-700 leading-relaxed font-mono bg-white border border-emerald-200 rounded-lg px-3 py-2 whitespace-pre-wrap break-words">
                        {step.detail}
                      </pre>
                    ) : (
                      <p className="text-xs text-gray-700 leading-relaxed">{step.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DAX code block */}
          {solution.daxCode && (
            <div className="bg-gray-900 rounded-xl px-4 py-3 overflow-x-auto">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">DAX</p>
              <pre className="text-xs font-mono text-green-400 leading-relaxed whitespace-pre-wrap break-words">
                {solution.daxCode}
              </pre>
            </div>
          )}

          {/* Exam note */}
          {solution.examNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">PL-300 Exam Note</p>
              <p className="text-xs text-amber-900 leading-relaxed">{solution.examNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CaseStudyContext({ context }) {
  const [expanded, setExpanded] = useState(true)
  if (!context) return null

  // Which requirement indices have questions vs only solutions
  const coveredByQuestion = new Set()
  ;(context.questions || []).forEach(q => {
    const idx = q.coversRequirementIndex
    if (Array.isArray(idx)) idx.forEach(i => coveredByQuestion.add(i))
    else if (idx !== undefined) coveredByQuestion.add(idx)
  })

  const solutions = context.recommendedSolutions || []
  const solutionByReq = Object.fromEntries(solutions.map(s => [s.requirementIndex, s]))

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

          {/* Requirements with status indicators */}
          {context.requirements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
                Business Requirements
              </p>
              <ol className="space-y-1.5">
                {context.requirements.map((req, i) => {
                  const hasQ = coveredByQuestion.has(i)
                  const hasS = !!solutionByReq[i]
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${
                        hasQ ? 'bg-blue-200 text-blue-700' : 'bg-emerald-200 text-emerald-800'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="leading-relaxed flex-1">{req}</span>
                      {hasQ && (
                        <span className="flex-shrink-0 text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full mt-0.5">
                          Question
                        </span>
                      )}
                      {!hasQ && hasS && (
                        <span className="flex-shrink-0 text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full mt-0.5">
                          Solution ↓
                        </span>
                      )}
                      {hasQ && hasS && (
                        <span className="flex-shrink-0 text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full mt-0.5 ml-1">
                          +Solution ↓
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
            </div>
          )}

          {/* Recommended Solutions for uncovered (or supplement) requirements */}
          {solutions.length > 0 && (
            <div className="space-y-2.5">
              {solutions.map((sol, i) => (
                <SolutionCard key={i} solution={sol} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
