import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WALKTHROUGHS, WALKTHROUGH_CATEGORIES } from '../data/walkthroughs'
import WalkthroughViewer from '../components/WalkthroughViewer'

const CATEGORY_STYLES = {
  DAX:              { pill: 'bg-blue-100 text-blue-700',   card: 'border-blue-200 hover:border-blue-400',   icon: '⚙️' },
  'Power Query':    { pill: 'bg-purple-100 text-purple-700', card: 'border-purple-200 hover:border-purple-400', icon: '🔄' },
  'Data Modeling':  { pill: 'bg-teal-100 text-teal-700',   card: 'border-teal-200 hover:border-teal-400',   icon: '⭐' },
  Security:         { pill: 'bg-red-100 text-red-700',     card: 'border-red-200 hover:border-red-400',     icon: '🔒' },
  Visualization:    { pill: 'bg-amber-100 text-amber-700', card: 'border-amber-200 hover:border-amber-400', icon: '📊' },
}

export default function WalkthroughsPage() {
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [active, setActive] = useState(null)

  const filtered = categoryFilter
    ? WALKTHROUGHS.filter(w => w.category === categoryFilter)
    : WALKTHROUGHS

  function open(wt) {
    setActive(wt)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
          <span className="text-sm font-semibold text-gray-900">Visual Walkthroughs</span>
          <span className="text-xs text-gray-400">{WALKTHROUGHS.length} walkthroughs</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Active viewer */}
        {active && (
          <div>
            <WalkthroughViewer
              walkthrough={active}
              onClose={() => setActive(null)}
            />
          </div>
        )}

        {/* Intro */}
        {!active && (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-2xl mb-3">
              <span className="text-2xl">▶</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Visual Walkthroughs</h1>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Step-by-step visual explanations of DAX, Power Query, modeling, and security concepts.
              Swipe or use arrow keys to navigate slides.
            </p>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
              !categoryFilter
                ? 'border-gray-800 bg-gray-800 text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            All ({WALKTHROUGHS.length})
          </button>
          {WALKTHROUGH_CATEGORIES.map(cat => {
            const style = CATEGORY_STYLES[cat] || {}
            const count = WALKTHROUGHS.filter(w => w.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(c => c === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                  categoryFilter === cat
                    ? `${style.pill} border-current`
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {style.icon} {cat} ({count})
              </button>
            )
          })}
        </div>

        {/* Walkthrough cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map(wt => {
            const style = CATEGORY_STYLES[wt.category] || { pill: 'bg-gray-100 text-gray-700', card: 'border-gray-200 hover:border-gray-400', icon: '📖' }
            const isActive = active?.id === wt.id
            return (
              <button
                key={wt.id}
                onClick={() => isActive ? setActive(null) : open(wt)}
                className={`text-left p-4 bg-white rounded-xl border-2 transition-colors ${
                  isActive
                    ? 'border-indigo-400 bg-indigo-50'
                    : style.card
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-sm font-bold text-gray-900">{wt.concept}</span>
                  <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${style.pill}`}>
                    {wt.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-snug mb-2">{wt.tagline}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{wt.slides?.length ?? 0} slides</span>
                  <span className={`text-xs font-semibold ${isActive ? 'text-indigo-600' : 'text-indigo-500'}`}>
                    {isActive ? '▼ Viewing' : '▶ Start'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
