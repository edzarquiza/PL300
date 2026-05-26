import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DAX_FUNCTIONS, DAX_CATEGORIES, CATEGORY_META } from '../data/daxFunctions'
import DaxFunctionDetail from '../components/DaxFunctionDetail'

const CATEGORY_CHIP_COLORS = {
  blue: 'border-blue-300 bg-blue-50 text-blue-700',
  purple: 'border-purple-300 bg-purple-50 text-purple-700',
  green: 'border-green-300 bg-green-50 text-green-700',
  orange: 'border-orange-300 bg-orange-50 text-orange-700',
  teal: 'border-teal-300 bg-teal-50 text-teal-700',
  gray: 'border-gray-300 bg-gray-100 text-gray-700',
  indigo: 'border-indigo-300 bg-indigo-50 text-indigo-700',
}

const CARD_BADGE_COLORS = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  teal: 'bg-teal-100 text-teal-700',
  gray: 'bg-gray-200 text-gray-700',
  indigo: 'bg-indigo-100 text-indigo-700',
}

const EXAM_WEIGHT_COLORS = {
  'Very High': 'text-red-600',
  'High': 'text-amber-600',
  'Medium': 'text-blue-500',
}

export default function DaxLibraryPage() {
  const navigate = useNavigate()
  const [selectedFn, setSelectedFn] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = DAX_FUNCTIONS.filter(fn => {
    if (categoryFilter && fn.category !== categoryFilter) return false
    if (search && !fn.functionName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // ── Detail view ────────────────────────────────────────────────────────────
  if (selectedFn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedFn(null)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← DAX Library
            </button>
            <span className="text-sm font-mono font-semibold text-gray-900">
              {selectedFn.functionName}
            </span>
            <span />
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
          <DaxFunctionDetail fn={selectedFn} />
        </main>
      </div>
    )
  }

  // ── Browse view ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Home
          </button>
          <h1 className="text-base font-semibold text-gray-900">DAX Function Library</h1>
          <span />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            Syntax, parameters, examples, and exam traps for key PL-300 DAX functions
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {DAX_FUNCTIONS.length} functions · {DAX_CATEGORIES.length} categories
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search functions…"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              categoryFilter === null
                ? 'border-gray-800 bg-gray-800 text-white'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            All
          </button>
          {DAX_CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat]
            const active = categoryFilter === cat
            const colors = CATEGORY_CHIP_COLORS[meta?.color ?? 'gray']
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(active ? null : cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active ? colors : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Function list */}
        {filtered.length === 0 ? (
          <p className="text-sm text-center text-gray-400 py-12">
            No functions match your search.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map(fn => {
              const meta = CATEGORY_META[fn.category]
              const badgeColors = CARD_BADGE_COLORS[meta?.color ?? 'gray']
              const weightColor = EXAM_WEIGHT_COLORS[fn.examWeight] ?? 'text-gray-400'
              return (
                <button
                  key={fn.functionName}
                  onClick={() => setSelectedFn(fn)}
                  className="w-full bg-white rounded-xl border border-gray-200 px-5 py-4 text-left hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-gray-900 text-sm">
                          {fn.functionName}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColors}`}
                        >
                          {fn.category}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-gray-400 truncate">
                        {fn.syntax}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs font-medium ${weightColor}`}>
                        {fn.examWeight}
                      </span>
                      <span className="text-xs text-gray-300 group-hover:text-gray-400 transition-colors">
                        →
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Syntax · Parameters · Examples · Traps · Related functions
        </p>
      </div>
    </div>
  )
}
