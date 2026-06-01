import { useState } from 'react'
import ConceptVisual from './ConceptVisual'
import WalkthroughViewer from './WalkthroughViewer'
import { getWalkthroughForTags } from '../data/walkthroughs'

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

export default function ConceptCard({ card, quizAnswer, onAnswer }) {
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const walkthrough = getWalkthroughForTags(card.tags ?? [])
  const answered = quizAnswer !== null
  const isCorrect = answered && quizAnswer === card.miniQuiz.correctAnswer

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
          {card.subtopic}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          card.difficulty === 'Easy'
            ? 'bg-green-100 text-green-700'
            : card.difficulty === 'Hard'
            ? 'bg-red-100 text-red-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {card.difficulty}
        </span>
        <span className="ml-auto text-xs text-gray-400">~{Math.round(card.estimatedReviewTime / 60)} min read</span>
      </div>

      {/* Concept name */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">{card.concept}</h2>

      {/* Summary */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">{card.summary}</p>

      {/* Visual representation */}
      {card.visual && <ConceptVisual visual={card.visual} />}

      {/* Inline walkthrough (if no card.visual but a walkthrough matches) */}
      {!card.visual && walkthrough && (
        <div className="mb-4">
          {showWalkthrough ? (
            <WalkthroughViewer
              walkthrough={walkthrough}
              onClose={() => setShowWalkthrough(false)}
            />
          ) : (
            <button
              onClick={() => setShowWalkthrough(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-colors text-xs font-semibold text-indigo-700"
            >
              <span>▶</span>
              <span>Visual Walkthrough — {walkthrough.concept}</span>
              <span className="text-indigo-400 font-normal">{walkthrough.slides?.length} slides</span>
            </button>
          )}
        </div>
      )}

      {/* Walkthrough button when card has visual too */}
      {card.visual && walkthrough && !showWalkthrough && (
        <button
          onClick={() => setShowWalkthrough(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors text-xs font-medium text-indigo-600 mb-4"
        >
          <span>▶</span>
          <span>Full Walkthrough — {walkthrough.slides?.length} slides</span>
        </button>
      )}
      {card.visual && walkthrough && showWalkthrough && (
        <div className="mb-4">
          <WalkthroughViewer walkthrough={walkthrough} onClose={() => setShowWalkthrough(false)} />
        </div>
      )}

      {/* Key Insight */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-3">
        <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Key Exam Insight</p>
        <p className="text-sm text-blue-900 leading-relaxed">{card.keyInsight}</p>
      </div>

      {/* Common Trap */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
        <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wide">Common Trap</p>
        <p className="text-sm text-amber-900 leading-relaxed">{card.commonTrap}</p>
      </div>

      {/* Mini Quiz */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Check</p>
        <p className="text-sm font-medium text-gray-900 leading-relaxed mb-4">{card.miniQuiz.question}</p>

        <div className="space-y-2 mb-4">
          {card.miniQuiz.choices.map((choice, i) => {
            const isCorrectChoice = i === card.miniQuiz.correctAnswer
            const isUserChoice = i === quizAnswer

            let style = 'border-gray-200 text-gray-700 hover:border-gray-300 cursor-pointer'
            if (answered) {
              if (isCorrectChoice) style = 'border-green-400 bg-green-50 text-green-900 cursor-default'
              else if (isUserChoice) style = 'border-red-400 bg-red-50 text-red-900 cursor-default'
              else style = 'border-gray-200 text-gray-400 cursor-default'
            }

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => onAnswer(i)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-colors disabled:cursor-default ${style}`}
              >
                <span className="font-semibold text-xs mr-2 opacity-50">{CHOICE_LABELS[i]}.</span>
                {choice}
                {answered && isCorrectChoice && (
                  <span className="ml-2 text-xs font-semibold text-green-600">✓</span>
                )}
                {answered && isUserChoice && !isCorrectChoice && (
                  <span className="ml-2 text-xs font-semibold text-red-600">✗</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Result feedback */}
        {answered && (
          <div className={`rounded-lg p-4 border ${
            isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-xs font-semibold mb-1.5 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '✓ Correct' : '✗ Incorrect — see explanation'}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{card.miniQuiz.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
