import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DATA_LABS, LAB_CATEGORIES } from '../data/dataLabs'

const DIFFICULTY_CFG = {
  Beginner:     { cls: 'bg-green-100 text-green-700 border-green-200' },
  Intermediate: { cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  Advanced:     { cls: 'bg-red-100 text-red-700 border-red-200' },
}

const CATEGORY_COLOR = {
  'Name Parsing':           'bg-violet-50 border-violet-100 text-violet-700',
  'Duplicate Records':      'bg-blue-50 border-blue-100 text-blue-700',
  'Date Cleanup':           'bg-amber-50 border-amber-100 text-amber-700',
  'Address Normalization':  'bg-teal-50 border-teal-100 text-teal-700',
  'Product Standardization':'bg-emerald-50 border-emerald-100 text-emerald-700',
  'Null & Missing Data':    'bg-rose-50 border-rose-100 text-rose-700',
  'Merge vs Append':        'bg-indigo-50 border-indigo-100 text-indigo-700',
  'Query Folding':          'bg-cyan-50 border-cyan-100 text-cyan-700',
  'Incremental Refresh':    'bg-orange-50 border-orange-100 text-orange-700',
  'Data Investigation':     'bg-purple-50 border-purple-100 text-purple-700',
}

function DataTable({ data, label, muted }) {
  if (!data) return null
  return (
    <div>
      {label && (
        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${muted ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs min-w-max">
          <thead>
            <tr className={muted ? 'bg-gray-100' : 'bg-gray-900'}>
              {data.headers.map(h => (
                <th
                  key={h}
                  className={`px-3 py-2 text-left font-semibold ${muted ? 'text-gray-500' : 'text-gray-300'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2 leading-snug ${
                      String(cell).startsWith('⚠') ? 'text-amber-700 font-medium' :
                      String(cell).startsWith('NO') ? 'text-red-600 font-medium' :
                      'text-gray-700'
                    }`}
                  >
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CollapseSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors text-left"
      >
        {title}
        <span className="flex-shrink-0 ml-2 text-gray-300">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100">{children}</div>}
    </div>
  )
}

function LabCard({ lab, onClick }) {
  const catCls = CATEGORY_COLOR[lab.category] ?? 'bg-gray-50 border-gray-200 text-gray-600'
  const diffCfg = DIFFICULTY_CFG[lab.difficulty] ?? DIFFICULTY_CFG.Beginner

  return (
    <button
      onClick={() => onClick(lab)}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${catCls}`}>
          {lab.category}
        </span>
        <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${diffCfg.cls}`}>
          {lab.difficulty}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors">
        {lab.title}
      </p>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {lab.scenario.slice(0, 120)}…
      </p>
      {lab.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {lab.tags.slice(0, 3).map(t => (
            <span key={t} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

function LabViewer({ lab, onBack }) {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const correctIdx = lab.options.findIndex(o => o.isCorrect)
  const isCorrect = revealed && selectedIdx === correctIdx
  const isWrong   = revealed && selectedIdx !== null && selectedIdx !== correctIdx

  function handleReveal() {
    if (selectedIdx === null) return
    setRevealed(true)
  }

  function handleReset() {
    setSelectedIdx(null)
    setRevealed(false)
  }

  const diffCfg = DIFFICULTY_CFG[lab.difficulty] ?? DIFFICULTY_CFG.Beginner

  return (
    <div className="space-y-6">

      {/* Back + header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          ← Back to labs
        </button>
        <div className="flex items-start gap-3 flex-wrap mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLOR[lab.category] ?? 'bg-gray-100 border-gray-200 text-gray-600'}`}>
            {lab.category}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffCfg.cls}`}>
            {lab.difficulty}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-snug">{lab.title}</h2>
      </div>

      {/* Scenario */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Scenario</p>
        <p className="text-sm text-blue-900 leading-relaxed">{lab.scenario}</p>
      </div>

      {/* Raw (messy) data */}
      <DataTable data={lab.rawData} label="Raw data — before cleaning" muted />

      {/* Problem */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">The Problem</p>
        <p className="text-sm text-amber-900 leading-relaxed">{lab.problem}</p>
      </div>

      {/* Options */}
      {!revealed && (
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Which approach is most appropriate?
          </p>
          {lab.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-snug transition-colors ${
                selectedIdx === i
                  ? 'bg-blue-50 border-blue-400 text-blue-900'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold mr-2 text-gray-500">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt.label}
            </button>
          ))}
          <button
            onClick={handleReveal}
            disabled={selectedIdx === null}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors mt-1 ${
              selectedIdx === null
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Reveal Answer
          </button>
        </div>
      )}

      {/* Revealed state */}
      {revealed && (
        <div className="space-y-5">

          {/* Result banner */}
          <div className={`rounded-xl border px-4 py-3 ${
            isCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className={`text-sm font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className={`text-xs mt-0.5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect
                    ? 'You chose the most appropriate approach.'
                    : `You chose ${String.fromCharCode(65 + selectedIdx)}. The correct answer is ${String.fromCharCode(65 + correctIdx)}.`
                  }
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition-colors flex-shrink-0"
              >
                Try again
              </button>
            </div>
          </div>

          {/* All options with correct/wrong highlighted */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Options</p>
            {lab.options.map((opt, i) => {
              const isThisCorrect = opt.isCorrect
              const isUserPick    = i === selectedIdx
              return (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-xl border text-sm leading-snug ${
                    isThisCorrect
                      ? 'bg-green-50 border-green-300 text-green-900'
                      : isUserPick
                        ? 'bg-red-50 border-red-300 text-red-900'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt.label}
                  {isThisCorrect && <span className="ml-2 text-green-600 font-bold">✓</span>}
                  {isUserPick && !isThisCorrect && <span className="ml-2 text-red-500 font-bold">✗</span>}
                </div>
              )
            })}
          </div>

          {/* Cleaned data */}
          <DataTable data={lab.cleanedData} label="Cleaned data — after transformation" />

          {/* Power Query Steps */}
          <CollapseSection title="Power Query Steps" defaultOpen>
            <ol className="space-y-2 pt-3">
              {lab.powerQuerySteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mt-0.5 text-xs">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </CollapseSection>

          {/* Analyst Thinking */}
          <CollapseSection title="Analyst Thinking" defaultOpen>
            <p className="text-xs text-gray-700 leading-relaxed pt-3">{lab.analystThinking}</p>
          </CollapseSection>

          {/* Microsoft Perspective */}
          <CollapseSection title="Microsoft Perspective">
            <p className="text-xs text-gray-700 leading-relaxed pt-3">{lab.microsoftPerspective}</p>
          </CollapseSection>

          {/* Performance Note (optional) */}
          {lab.performanceNote && (
            <CollapseSection title="Performance Note">
              <p className="text-xs text-gray-700 leading-relaxed pt-3">{lab.performanceNote}</p>
            </CollapseSection>
          )}

          {/* Exam Tip */}
          {lab.examTip && (
            <CollapseSection title="Exam Tip">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-3 mt-3">
                <p className="text-xs text-yellow-900 leading-relaxed">{lab.examTip}</p>
              </div>
            </CollapseSection>
          )}

          {/* Tags */}
          {lab.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lab.tags.map(t => (
                <span key={t} className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DataLabsPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedLab, setSelectedLab] = useState(null)

  const visibleLabs = activeCategory === 'All'
    ? DATA_LABS
    : DATA_LABS.filter(l => l.category === activeCategory)

  if (selectedLab) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <LabViewer lab={selectedLab} onBack={() => setSelectedLab(null)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Labs</h1>
            <p className="text-sm text-gray-500 mt-0.5">Real-world Power Query scenarios · {DATA_LABS.length} labs</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-500 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            ← Home
          </button>
        </div>

        {/* Category tabs */}
        <div
          className="flex gap-1.5 mb-6 pb-1 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LAB_CATEGORIES.map(cat => {
            const count = cat === 'All'
              ? DATA_LABS.length
              : DATA_LABS.filter(l => l.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat}
                {count > 0 && (
                  <span className={`ml-1.5 ${activeCategory === cat ? 'text-gray-300' : 'text-gray-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Labs grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleLabs.map(lab => (
            <LabCard key={lab.id} lab={lab} onClick={setSelectedLab} />
          ))}
        </div>

        {visibleLabs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No labs in this category yet.</p>
          </div>
        )}

      </div>
    </div>
  )
}
