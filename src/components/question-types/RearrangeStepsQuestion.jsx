import { useRef, useState } from 'react'

function RearrangeReview({ question, answer }) {
  const correctOrder = question.correctOrder
  const userOrder = answer ?? []

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Correct Order</p>
      <div className="space-y-2">
        {correctOrder.map((step, correctIdx) => {
          const userIdx = userOrder.indexOf(step)
          const wasCorrect = userIdx === correctIdx
          return (
            <div
              key={step}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${
                wasCorrect ? 'border-green-300 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0 ${
                wasCorrect ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
              }`}>
                {correctIdx + 1}
              </span>
              <span className="text-sm text-gray-700 flex-1">{step}</span>
              {wasCorrect
                ? <span className="text-xs text-green-600 flex-shrink-0 font-medium">✓</span>
                : userOrder.length > 0 && (
                    <span className="text-xs text-red-500 flex-shrink-0">
                      You placed #{userIdx >= 0 ? userIdx + 1 : '—'}
                    </span>
                  )
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function RearrangeStepsQuestion({ question, answer, onAnswer, isReviewMode }) {
  const dragItem = useRef(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)

  if (isReviewMode) return <RearrangeReview question={question} answer={answer} />

  // Display order: use saved answer or the default shuffled order from JSON
  const steps = answer ?? question.steps

  function reorder(from, to) {
    if (from === to) return
    const next = [...steps]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onAnswer(next)
  }

  function moveUp(i) { if (i > 0) reorder(i, i - 1) }
  function moveDown(i) { if (i < steps.length - 1) reorder(i, i + 1) }

  // ── Drag handlers ────────────────────────────────────────────────────────
  function handleDragStart(i) { dragItem.current = i }
  function handleDragEnter(i) { setDragOverIdx(i) }
  function handleDragOver(e) { e.preventDefault() }
  function handleDragEnd() {
    if (dragItem.current !== null && dragOverIdx !== null) reorder(dragItem.current, dragOverIdx)
    dragItem.current = null
    setDragOverIdx(null)
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">Drag items or use ▲▼ arrows to reorder</p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div
            key={step}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 px-4 py-3 bg-white border-2 rounded-lg transition-colors select-none ${
              dragOverIdx === i && dragItem.current !== i
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-gray-300 text-base cursor-grab flex-shrink-0" title="Drag to reorder">
              ⠿⠿
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-500 bg-gray-100 rounded-full flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-gray-700 flex-1">{step}</span>
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-25 leading-none text-xs"
                title="Move up"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(i)}
                disabled={i === steps.length - 1}
                className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-25 leading-none text-xs"
                title="Move down"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
