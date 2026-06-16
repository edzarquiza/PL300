import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RelationshipDiagram from '../components/RelationshipDiagram'
import { RELATIONSHIP_SCENARIOS, SCENARIO_CATEGORIES } from '../data/relationshipScenarios'

// ── Difficulty badge ─────────────────────────────────────────────────────────

const DIFF_CLS = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-red-100 text-red-700',
}

const CAT_COLORS = {
  Cardinality:               'bg-blue-50 text-blue-700 border-blue-100',
  'Filter Flow':             'bg-purple-50 text-purple-700 border-purple-100',
  'Active vs Inactive':      'bg-amber-50 text-amber-700 border-amber-100',
  'Role-Playing Dimensions': 'bg-teal-50 text-teal-700 border-teal-100',
  'Star Schema':             'bg-indigo-50 text-indigo-700 border-indigo-100',
  Diagnostics:               'bg-red-50 text-red-700 border-red-100',
}

// ── Sample data table ────────────────────────────────────────────────────────

function SampleDataSection({ sampleData }) {
  if (!sampleData) return null
  return (
    <div className="space-y-3 mt-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sample Data</p>
      {Object.entries(sampleData).map(([tableName, { headers, rows }]) => (
        <div key={tableName}>
          <p className="text-xs font-semibold text-gray-600 mb-1">{tableName}</p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {headers.map(h => (
                    <th key={h} className="text-left px-2.5 py-1.5 font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-2.5 py-1.5 text-gray-700 border-b border-gray-100 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Scenario Viewer ──────────────────────────────────────────────────────────

function ScenarioViewer({ scenario, onBack }) {
  const [stepIdx, setStepIdx] = useState(0)
  const step = scenario.steps[stepIdx]
  const isLast = stepIdx === scenario.steps.length - 1

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors flex-shrink-0"
        >
          ← Lab
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{scenario.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${CAT_COLORS[scenario.category] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}>
              {scenario.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${DIFF_CLS[scenario.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
              {scenario.difficulty}
            </span>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {scenario.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIdx(i)}
              className={`w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
                i === stepIdx
                  ? 'bg-blue-600 text-white'
                  : i < stepIdx
                  ? 'bg-blue-200 text-blue-700'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Step title */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Step {stepIdx + 1} of {scenario.steps.length}
          </p>
          <h2 className="text-lg font-bold text-gray-900">{step.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mt-1.5">{step.explanation}</p>
        </div>

        {/* Relationship Diagram */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <RelationshipDiagram diagram={step.diagram} />
        </div>

        {/* Sample Data */}
        {step.sampleData && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <SampleDataSection sampleData={step.sampleData} />
          </div>
        )}

        {/* Last step: concept summary */}
        {isLast && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1.5">Concept</p>
              <p className="text-sm font-semibold text-blue-900">{scenario.concept}</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1.5">How Microsoft Thinks</p>
              <p className="text-sm text-purple-900 leading-relaxed">{scenario.microsoftThinking}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1.5">Exam Tip</p>
              <p className="text-sm text-amber-900 leading-relaxed">{scenario.examTip}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setStepIdx(i => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          {!isLast ? (
            <button
              onClick={() => setStepIdx(i => i + 1)}
              className="text-sm font-semibold px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onBack}
              className="text-sm font-semibold px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Back to Lab ✓
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Scenario Card ─────────────────────────────────────────────────────────────

function ScenarioCard({ scenario, onClick }) {
  const catCls = CAT_COLORS[scenario.category] ?? 'bg-gray-50 text-gray-600 border-gray-100'
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${catCls}`}>
          {scenario.category}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${DIFF_CLS[scenario.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
          {scenario.difficulty}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-blue-700 transition-colors">
        {scenario.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{scenario.description}</p>
      <div className="mt-3 flex items-center gap-1.5">
        {Array.from({ length: scenario.steps.length }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-300 transition-colors" />
        ))}
        <span className="text-xs text-gray-400 ml-1">{scenario.steps.length} steps</span>
      </div>
    </button>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RelationshipLabPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedScenario, setSelectedScenario] = useState(null)

  if (selectedScenario) {
    return (
      <ScenarioViewer
        scenario={selectedScenario}
        onBack={() => setSelectedScenario(null)}
      />
    )
  }

  const visible = selectedCategory === 'All'
    ? RELATIONSHIP_SCENARIOS
    : RELATIONSHIP_SCENARIOS.filter(s => s.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Home
            </button>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">⬡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Relationship Lab</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                See how Power BI relationships work — filter propagation, cardinality, active vs inactive, and star schema design.
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <span>{RELATIONSHIP_SCENARIOS.length} scenarios</span>
            <span>·</span>
            <span>{SCENARIO_CATEGORIES.length - 1} categories</span>
            <span>·</span>
            <span>Interactive step-through</span>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {SCENARIO_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario grid */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {visible.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">No scenarios in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visible.map(scenario => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onClick={() => setSelectedScenario(scenario)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
