import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TERMS, TERM_CATEGORIES } from '../data/terminology'
import {
  getWeakTermIds,
  markTermWeak,
  markTermKnown,
  recordTermView,
} from '../services/terminologyProgressService'

// ── Colour maps ────────────────────────────────────────────────────────────────

const CAT_COLORS = {
  fundamentals: { chip: 'border-sky-300 bg-sky-50 text-sky-700',         badge: 'bg-sky-100 text-sky-700',         active: 'border-sky-500 bg-sky-100 text-sky-800'    },
  dax:          { chip: 'border-purple-300 bg-purple-50 text-purple-700', badge: 'bg-purple-100 text-purple-700',   active: 'border-purple-500 bg-purple-100 text-purple-800' },
  modeling:     { chip: 'border-orange-300 bg-orange-50 text-orange-700', badge: 'bg-orange-100 text-orange-700',   active: 'border-orange-500 bg-orange-100 text-orange-800' },
  power_query:  { chip: 'border-green-300 bg-green-50 text-green-700',    badge: 'bg-green-100 text-green-700',     active: 'border-green-500 bg-green-100 text-green-800'   },
  security:     { chip: 'border-red-300 bg-red-50 text-red-700',          badge: 'bg-red-100 text-red-700',         active: 'border-red-500 bg-red-100 text-red-800'         },
  fabric:       { chip: 'border-indigo-300 bg-indigo-50 text-indigo-700', badge: 'bg-indigo-100 text-indigo-700',   active: 'border-indigo-500 bg-indigo-100 text-indigo-800' },
}

const RELEVANCE_COLOR = {
  'Very High': 'text-red-600 font-semibold',
  'High':      'text-amber-600 font-semibold',
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function CategoryBadge({ categoryId }) {
  const cat = TERM_CATEGORIES.find(c => c.id === categoryId)
  const col = CAT_COLORS[categoryId] ?? { badge: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${col.badge}`}>
      {cat?.label ?? categoryId}
    </span>
  )
}

function TermDetail({ term }) {
  return (
    <div className="space-y-4 text-sm text-gray-700">

      {term.acronym && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Meaning</p>
          <p className="text-gray-600">{term.fullMeaning}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">What it is</p>
        <p>{term.simpleExplanation}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Why it matters</p>
        <p>{term.whyItMatters}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Real-world example</p>
        <p className="text-gray-600 italic">{term.realWorldExample}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Exam tip</p>
        <p className="text-amber-800">{term.examTip}</p>
      </div>

      {term.relatedTerms.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Related terms</p>
          <div className="flex flex-wrap gap-1.5">
            {term.relatedTerms.map(rt => (
              <span key={rt} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{rt}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
        <span>PL-300 Relevance</span>
        <span className={RELEVANCE_COLOR[term.pl300Relevance.split(' ').slice(0, 2).join(' ')] ?? 'text-gray-500'}>
          {term.pl300Relevance}
        </span>
      </div>

    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function TerminologyPage() {
  const navigate = useNavigate()

  const [mode, setMode]                 = useState('browse')   // 'browse' | 'flashcard'
  const [search, setSearch]             = useState('')
  const [categoryFilter, setCatFilter]  = useState(null)
  const [weakOnly, setWeakOnly]         = useState(false)
  const [expandedId, setExpandedId]     = useState(null)
  const [flashIndex, setFlashIndex]     = useState(0)
  const [flashRevealed, setFlashRevealed] = useState(false)
  const [weakIds, setWeakIds]           = useState(() => new Set(getWeakTermIds()))

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return TERMS.filter(t => {
      if (categoryFilter && t.category !== categoryFilter) return false
      if (weakOnly && !weakIds.has(t.id)) return false
      if (!q) return true
      return (
        t.term.toLowerCase().includes(q) ||
        (t.acronym ?? '').toLowerCase().includes(q) ||
        t.fullMeaning.toLowerCase().includes(q) ||
        t.simpleExplanation.toLowerCase().includes(q) ||
        t.relatedTerms.some(r => r.toLowerCase().includes(q))
      )
    })
  }, [search, categoryFilter, weakOnly, weakIds])

  const weakCount     = weakIds.size
  const safeFlashIdx  = Math.min(flashIndex, Math.max(0, filtered.length - 1))
  const flashTerm     = filtered[safeFlashIdx] ?? null

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleToggleExpand(id) {
    const next = expandedId === id ? null : id
    setExpandedId(next)
    if (next) recordTermView(id)
  }

  function handleToggleWeak(termId) {
    if (weakIds.has(termId)) {
      markTermKnown(termId)
      setWeakIds(prev => { const n = new Set(prev); n.delete(termId); return n })
    } else {
      markTermWeak(termId)
      setWeakIds(prev => new Set([...prev, termId]))
    }
  }

  function handleFlashNext() {
    setFlashIndex(i => Math.min(filtered.length - 1, i + 1))
    setFlashRevealed(false)
  }

  function handleFlashPrev() {
    setFlashIndex(i => Math.max(0, i - 1))
    setFlashRevealed(false)
  }

  function handleReveal() {
    setFlashRevealed(true)
    if (flashTerm) recordTermView(flashTerm.id)
  }

  function switchMode(next) {
    setMode(next)
    setFlashIndex(0)
    setFlashRevealed(false)
    setExpandedId(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">

          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            ← Home
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold text-gray-900 truncate">Terminology</span>
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 flex-shrink-0">
              {TERMS.length} terms
            </span>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs flex-shrink-0">
            <button
              onClick={() => switchMode('browse')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                mode === 'browse'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => switchMode('flashcard')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                mode === 'flashcard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Flashcard
            </button>
          </div>

        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-5 pb-16">

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setFlashIndex(0) }}
            placeholder="Search terms, acronyms, keywords..."
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base select-none">
            ⌕
          </span>
          {search && (
            <button
              onClick={() => { setSearch(''); setFlashIndex(0) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Category + Weak chips ─────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
          {/* All */}
          <button
            onClick={() => { setCatFilter(null); setFlashIndex(0) }}
            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              categoryFilter === null && !weakOnly
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            All
          </button>

          {TERM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCatFilter(prev => prev === cat.id ? null : cat.id)
                setFlashIndex(0)
              }}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                categoryFilter === cat.id
                  ? CAT_COLORS[cat.id]?.active ?? CAT_COLORS[cat.id]?.chip
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Weak filter */}
          <button
            onClick={() => { setWeakOnly(w => !w); setFlashIndex(0) }}
            className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              weakOnly
                ? 'border-red-400 bg-red-50 text-red-700'
                : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600'
            }`}
          >
            Weak{weakCount > 0 && <span className="ml-1 opacity-70">({weakCount})</span>}
          </button>
        </div>

        {/* Count line */}
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length === TERMS.length
            ? `${TERMS.length} terms`
            : `${filtered.length} of ${TERMS.length} terms`}
        </p>

        {/* ════════════════════════════════════════════════════════════════════
            BROWSE MODE
        ════════════════════════════════════════════════════════════════════ */}
        {mode === 'browse' && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-gray-400">No terms match your filters.</p>
                {weakOnly && weakCount === 0 && (
                  <p className="text-xs text-gray-400 mt-2">Mark terms as weak during review to track them here.</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(term => {
                  const isExpanded = expandedId === term.id
                  const isWeak     = weakIds.has(term.id)

                  return (
                    <div
                      key={term.id}
                      className={`bg-white rounded-xl border transition-colors ${
                        isExpanded ? 'border-blue-200 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {/* Card header (clickable row) */}
                      <button
                        onClick={() => handleToggleExpand(term.id)}
                        className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isWeak && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400" title="Marked weak" />
                          )}
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {term.acronym ?? term.term}
                          </span>
                          {term.acronym && (
                            <span className="text-xs text-gray-400 truncate hidden sm:block">
                              {term.fullMeaning}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <CategoryBadge categoryId={term.category} />
                          <span className={`text-gray-300 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </button>

                      {/* Expanded body */}
                      {isExpanded && (
                        <div className="px-4 pb-5 border-t border-gray-100">
                          {term.acronym && (
                            <p className="text-2xl font-bold text-gray-900 mt-4 mb-1">{term.term}</p>
                          )}
                          <div className="mt-4">
                            <TermDetail term={term} />
                          </div>
                          <div className="mt-5 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => handleToggleWeak(term.id)}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                                isWeak
                                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                  : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600'
                              }`}
                            >
                              {isWeak ? '✓ Marked Weak — click to remove' : '⚑ Mark as Weak'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            FLASHCARD MODE
        ════════════════════════════════════════════════════════════════════ */}
        {mode === 'flashcard' && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-gray-400">No terms match your filters.</p>
                {weakOnly && weakCount === 0 && (
                  <p className="text-xs text-gray-400 mt-2">Switch to Browse mode and mark terms as weak first.</p>
                )}
              </div>
            ) : !flashTerm ? null : (
              <>
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all"
                      style={{ width: `${((safeFlashIdx + 1) / filtered.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {safeFlashIdx + 1} / {filtered.length}
                  </span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                  {/* Front */}
                  <div className="px-6 py-8 text-center">
                    <CategoryBadge categoryId={flashTerm.category} />

                    <h2 className="mt-5 text-4xl font-bold text-gray-900 leading-tight">
                      {flashTerm.acronym ?? flashTerm.term}
                    </h2>

                    {flashTerm.acronym && (
                      <p className="mt-1.5 text-sm text-gray-500">{flashTerm.term}</p>
                    )}

                    {weakIds.has(flashTerm.id) && (
                      <p className="mt-2 text-xs text-red-500 font-medium">⚑ Marked weak</p>
                    )}

                    {!flashRevealed && (
                      <button
                        onClick={handleReveal}
                        className="mt-6 px-7 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Reveal Definition
                      </button>
                    )}
                  </div>

                  {/* Back (revealed) */}
                  {flashRevealed && (
                    <div className="px-5 pb-6 border-t border-gray-100 pt-5">
                      <TermDetail term={flashTerm} />
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={handleFlashPrev}
                    disabled={safeFlashIdx === 0}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>

                  <button
                    onClick={() => handleToggleWeak(flashTerm.id)}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-colors ${
                      weakIds.has(flashTerm.id)
                        ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    {weakIds.has(flashTerm.id) ? '✓ I Know This' : '⚑ Mark Weak'}
                  </button>

                  <button
                    onClick={handleFlashNext}
                    disabled={safeFlashIdx === filtered.length - 1}
                    className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>

                {/* Dot navigation (compact, only when ≤ 25 cards) */}
                {filtered.length <= 25 && (
                  <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
                    {filtered.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => { setFlashIndex(i); setFlashRevealed(false) }}
                        title={t.acronym ?? t.term}
                        className={`rounded-full transition-all ${
                          i === safeFlashIdx
                            ? 'w-4 h-2 bg-blue-500'
                            : weakIds.has(t.id)
                              ? 'w-2 h-2 bg-red-300 hover:bg-red-400'
                              : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

              </>
            )}
          </>
        )}

      </div>
    </div>
  )
}
