import { useRef, useState } from 'react'

// Review display — shows correct mapping vs user mapping per prompt
function DragDropReview({ question, answer }) {
  const mapping = answer ?? {}
  return (
    <div className="space-y-3">
      {question.prompts.map(prompt => {
        const userChoice = mapping[prompt]
        const correctChoice = question.correctMapping?.[prompt]
        const isCorrect = userChoice === correctChoice
        return (
          <div key={prompt} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="text-sm text-gray-700 font-medium flex-1 min-w-0">{prompt}</div>
            <div className={`flex-shrink-0 min-w-[9rem] px-3 py-2 rounded-lg border-2 text-sm ${
              isCorrect
                ? 'border-green-400 bg-green-50 text-green-800'
                : userChoice
                ? 'border-red-400 bg-red-50 text-red-800'
                : 'border-gray-200 bg-gray-50 text-gray-400 italic'
            }`}>
              <div className="font-medium">{userChoice ?? 'Not placed'}</div>
              {!isCorrect && (
                <div className="text-xs text-green-600 mt-0.5 font-semibold">✓ {correctChoice}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function DragDropQuestion({ question, answer, onAnswer, isReviewMode }) {
  const dragInfo = useRef(null)
  const [dragOverSlot, setDragOverSlot] = useState(null)
  // click-to-assign: track which choice chip is "selected" waiting for a slot click
  const [pendingChoice, setPendingChoice] = useState(null)

  if (isReviewMode) return <DragDropReview question={question} answer={answer} />

  const mapping = answer ?? {}
  const placedValues = new Set(Object.values(mapping))
  const available = question.choices.filter(c => !placedValues.has(c))

  function applyMapping(newMapping) {
    onAnswer(Object.keys(newMapping).length > 0 ? newMapping : null)
  }

  // ── Drag API ────────────────────────────────────────────────────────────
  function handleChoiceDragStart(choiceText, sourceSlot = null) {
    dragInfo.current = { choiceText, sourceSlot }
    setPendingChoice(null)
  }

  function handleSlotDragOver(e, prompt) {
    e.preventDefault()
    setDragOverSlot(prompt)
  }

  function handleSlotDrop(e, prompt) {
    e.preventDefault()
    setDragOverSlot(null)
    if (!dragInfo.current) return
    const { choiceText, sourceSlot } = dragInfo.current
    const next = { ...mapping }
    if (sourceSlot) delete next[sourceSlot]
    next[prompt] = choiceText
    applyMapping(next)
    dragInfo.current = null
  }

  function handleDragEnd() {
    dragInfo.current = null
    setDragOverSlot(null)
  }

  // ── Click-to-assign API ──────────────────────────────────────────────────
  function handleChoiceClick(choiceText, sourceSlot = null) {
    if (pendingChoice === choiceText) {
      setPendingChoice(null)
      return
    }
    setPendingChoice(choiceText)
    // If choice is already placed, mark its source slot
    if (sourceSlot) {
      // clicking an already-placed chip selects it for reassignment
    }
  }

  function handleSlotClick(prompt) {
    if (!pendingChoice) return
    const sourceSlot = Object.entries(mapping).find(([, v]) => v === pendingChoice)?.[0] ?? null
    const next = { ...mapping }
    if (sourceSlot) delete next[sourceSlot]
    next[prompt] = pendingChoice
    applyMapping(next)
    setPendingChoice(null)
  }

  function handleRemove(prompt) {
    const next = { ...mapping }
    delete next[prompt]
    setPendingChoice(null)
    applyMapping(next)
  }

  return (
    <div>
      {/* Available choice pool */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Available choices — drag or click to assign
        </p>
        <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          {available.map(choice => (
            <div
              key={choice}
              draggable
              onDragStart={() => handleChoiceDragStart(choice, null)}
              onDragEnd={handleDragEnd}
              onClick={() => handleChoiceClick(choice, null)}
              className={`px-3 py-1.5 rounded-lg border-2 text-sm cursor-pointer select-none transition-colors ${
                pendingChoice === choice
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              ⠿ {choice}
            </div>
          ))}
          {available.length === 0 && (
            <span className="text-xs text-gray-400 italic self-center">All choices placed</span>
          )}
        </div>
      </div>

      {/* Prompt slots */}
      <div className="space-y-3">
        {question.prompts.map(prompt => {
          const placed = mapping[prompt]
          const isOver = dragOverSlot === prompt
          const isHighlighted = pendingChoice && !placed

          return (
            <div key={prompt} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="text-sm text-gray-700 font-medium flex-1 min-w-0">{prompt}</div>
              <div
                onDragOver={e => handleSlotDragOver(e, prompt)}
                onDrop={e => handleSlotDrop(e, prompt)}
                onDragLeave={() => setDragOverSlot(null)}
                onClick={() => handleSlotClick(prompt)}
                className={`flex-shrink-0 min-w-[9rem] min-h-[40px] rounded-lg border-2 transition-colors flex items-center px-3 cursor-pointer ${
                  isOver
                    ? 'border-blue-400 bg-blue-50'
                    : isHighlighted
                    ? 'border-blue-300 bg-blue-50 border-dashed'
                    : placed
                    ? 'border-gray-300 bg-white'
                    : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              >
                {placed ? (
                  <div className="flex items-center justify-between w-full gap-2">
                    <div
                      draggable
                      onDragStart={() => handleChoiceDragStart(placed, prompt)}
                      onDragEnd={handleDragEnd}
                      onClick={e => { e.stopPropagation(); handleChoiceClick(placed, prompt) }}
                      className={`text-sm cursor-pointer select-none flex-1 ${
                        pendingChoice === placed ? 'text-blue-700 font-medium' : 'text-gray-800'
                      }`}
                    >
                      {placed}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleRemove(prompt) }}
                      className="text-gray-400 hover:text-red-500 text-xs flex-shrink-0 transition-colors"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    {pendingChoice ? 'Click to place' : 'Drop here'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
