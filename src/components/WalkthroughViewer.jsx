import { useState, useEffect, useRef } from 'react'
import IntroSlide from './walkthrough/IntroSlide'
import DataTableSlide from './walkthrough/DataTableSlide'
import DaxSlide from './walkthrough/DaxSlide'
import FilteredTableSlide from './walkthrough/FilteredTableSlide'
import IteratorSlide from './walkthrough/IteratorSlide'
import ResultSlide from './walkthrough/ResultSlide'
import TransformSlide from './walkthrough/TransformSlide'
import ComparisonSlide from './walkthrough/ComparisonSlide'
import RlsSlide from './walkthrough/RlsSlide'
import TextSlide from './walkthrough/TextSlide'

const SLIDE_COMPONENTS = {
  intro: IntroSlide,
  table: DataTableSlide,
  dax: DaxSlide,
  'filtered-table': FilteredTableSlide,
  iterator: IteratorSlide,
  result: ResultSlide,
  transform: TransformSlide,
  comparison: ComparisonSlide,
  rls: RlsSlide,
  text: TextSlide,
}

const CATEGORY_COLORS = {
  DAX: 'text-blue-700 bg-blue-50 border-blue-200',
  'Power Query': 'text-purple-700 bg-purple-50 border-purple-200',
  'Data Modeling': 'text-teal-700 bg-teal-50 border-teal-200',
  Security: 'text-red-700 bg-red-50 border-red-200',
  Visualization: 'text-amber-700 bg-amber-50 border-amber-200',
}

export default function WalkthroughViewer({ walkthrough, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const touchStartX = useRef(null)
  const slides = walkthrough.slides || []
  const total = slides.length
  const catColor = CATEGORY_COLORS[walkthrough.category] || 'text-indigo-700 bg-indigo-50 border-indigo-200'

  useEffect(() => {
    setCurrentIdx(0)
  }, [walkthrough.id])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') setCurrentIdx(i => Math.min(i + 1, total - 1))
      if (e.key === 'ArrowLeft')  setCurrentIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total])

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      delta > 0
        ? setCurrentIdx(i => Math.min(i + 1, total - 1))
        : setCurrentIdx(i => Math.max(i - 1, 0))
    }
    touchStartX.current = null
  }

  const slide = slides[currentIdx]
  if (!slide) return null
  const SlideComponent = SLIDE_COMPONENTS[slide.type] || TextSlide

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-indigo-500 text-xs">▶</span>
          <span className="text-xs font-bold text-gray-700 truncate">{walkthrough.concept}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${catColor}`}>
            {walkthrough.category}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {currentIdx + 1} / {total}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm leading-none"
              aria-label="Close walkthrough"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Slide content */}
      <div className="px-4 py-5 min-h-[220px]">
        <SlideComponent slide={slide} />
      </div>

      {/* Footer: dots + navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/60">
        <button
          onClick={() => setCurrentIdx(i => Math.max(i - 1, 0))}
          disabled={currentIdx === 0}
          className="text-xs font-medium text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`rounded-full transition-all ${
                i === currentIdx
                  ? 'w-4 h-2 bg-indigo-500'
                  : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIdx(i => Math.min(i + 1, total - 1))}
          disabled={currentIdx === total - 1}
          className="text-xs font-medium text-white px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
