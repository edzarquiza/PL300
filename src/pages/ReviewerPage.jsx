import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExamHistory, getWeakDomains } from '../services/historyService'
import { getSubtopicMastery } from '../services/masteryService'
import ConceptCard from '../components/ConceptCard'
import daxCards from '../data/reviewers/daxReviewer.json'
import pqCards from '../data/reviewers/powerQueryReviewer.json'
import modelingCards from '../data/reviewers/modelingReviewer.json'
import vizCards from '../data/reviewers/visualizationReviewer.json'
import secCards from '../data/reviewers/securityReviewer.json'
import trapCards from '../data/reviewers/trapReviewer.json'

const CATEGORIES = [
  {
    id: 'dax',
    name: 'DAX',
    description: 'Filter context, iterators, time intelligence, measures',
    color: 'purple',
    cards: daxCards,
  },
  {
    id: 'power_query',
    name: 'Power Query',
    description: 'Merge, append, query folding, transformations',
    color: 'green',
    cards: pqCards,
  },
  {
    id: 'modeling',
    name: 'Data Modeling',
    description: 'Star schema, relationships, cardinality, DirectQuery',
    color: 'orange',
    cards: modelingCards,
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Visuals, drillthrough, bookmarks, mobile layout',
    color: 'teal',
    cards: vizCards,
  },
  {
    id: 'security',
    name: 'Security & Service',
    description: 'RLS, workspace roles, gateway, deployment pipelines',
    color: 'red',
    cards: secCards,
  },
  {
    id: 'traps',
    name: 'Microsoft Traps',
    description: 'High-yield conceptual traps that commonly appear on PL-300',
    color: 'rose',
    cards: trapCards,
  },
]

const COLOR_MAP = {
  purple: {
    border: 'border-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700',
  },
  green: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    button: 'bg-green-600 hover:bg-green-700',
  },
  orange: {
    border: 'border-orange-400',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
    button: 'bg-orange-600 hover:bg-orange-700',
  },
  teal: {
    border: 'border-teal-400',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    badge: 'bg-teal-100 text-teal-700',
    button: 'bg-teal-600 hover:bg-teal-700',
  },
  red: {
    border: 'border-red-400',
    bg: 'bg-red-50',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
    button: 'bg-red-600 hover:bg-red-700',
  },
  rose: {
    border: 'border-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    button: 'bg-rose-600 hover:bg-rose-700',
  },
}

const ALL_CARDS = [...daxCards, ...pqCards, ...modelingCards, ...vizCards, ...secCards, ...trapCards]

function findWeakCards(history) {
  if (!history.length) return []
  const weakDomains = getWeakDomains(history)
  const mastery = getSubtopicMastery(history)
  const weakSubtopics = mastery
    .filter(m => m.pct < 70)
    .map(m => m.subtopic.toLowerCase())

  return ALL_CARDS.filter(card => {
    if (weakDomains.some(d => d === card.domain)) return true
    if (
      weakSubtopics.length > 0 &&
      card.tags?.some(t =>
        weakSubtopics.some(
          w => t.toLowerCase().includes(w) || w.includes(t.toLowerCase())
        )
      )
    )
      return true
    return false
  })
}

export default function ReviewerPage() {
  const navigate = useNavigate()
  const history = getExamHistory()

  const [view, setView] = useState('menu') // 'menu' | 'session' | 'done'
  const [cards, setCards] = useState([])
  const [sessionLabel, setSessionLabel] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})

  const weakCards = findWeakCards(history)
  const hasWeakAreas = weakCards.length > 0

  function startSession(sessionCards, label) {
    setCards(sessionCards)
    setSessionLabel(label)
    setCardIndex(0)
    setQuizAnswers({})
    setView('session')
  }

  function handleAnswer(cardId, answerIndex) {
    setQuizAnswers(prev => ({ ...prev, [cardId]: answerIndex }))
  }

  const currentCard = cards[cardIndex]
  const isLastCard = cardIndex === cards.length - 1
  const correctCount = cards.filter(
    c => quizAnswers[c.id] === c.miniQuiz.correctAnswer
  ).length

  // ── Done view ──────────────────────────────────────────────────────────────
  if (view === 'done') {
    const pct = cards.length > 0 ? Math.round((correctCount / cards.length) * 100) : 0
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setView('menu')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Reviewer
            </button>
            <h1 className="text-base font-semibold text-gray-900">{sessionLabel}</h1>
            <span />
          </div>
        </header>

        <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full text-center">
            <p className="text-5xl font-bold text-gray-900 mb-1">{correctCount}/{cards.length}</p>
            <p className="text-sm text-gray-400 mb-6">quick checks correct</p>

            <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
              <div
                className={`h-2 rounded-full transition-all ${pct >= 70 ? 'bg-green-500' : 'bg-amber-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 mb-8">
              {correctCount === cards.length
                ? 'All concepts recalled correctly. Great work!'
                : `Review the ${cards.length - correctCount} concept${cards.length - correctCount !== 1 ? 's' : ''} you missed before your next exam.`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { setCardIndex(0); setQuizAnswers({}); setView('session') }}
                className="flex-1 py-3 text-sm font-medium border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Retake
              </button>
              <button
                onClick={() => setView('menu')}
                className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Back to Reviewer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Session view ───────────────────────────────────────────────────────────
  if (view === 'session') {
    const progressPct = ((cardIndex + 1) / cards.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setView('menu')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Categories
            </button>
            <span className="text-sm font-semibold text-gray-700">{sessionLabel}</span>
            <span className="text-sm text-gray-400">
              {cardIndex + 1} / {cards.length}
            </span>
          </div>
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
          {currentCard && (
            <ConceptCard
              card={currentCard}
              quizAnswer={quizAnswers[currentCard.id] ?? null}
              onAnswer={i => handleAnswer(currentCard.id, i)}
            />
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 sticky bottom-0">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setCardIndex(p => Math.max(0, p - 1))}
              disabled={cardIndex === 0}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {isLastCard ? (
              <button
                onClick={() => setView('done')}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finish
              </button>
            ) : (
              <button
                onClick={() => setCardIndex(p => Math.min(cards.length - 1, p + 1))}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </footer>
      </div>
    )
  }

  // ── Menu view ──────────────────────────────────────────────────────────────
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
          <h1 className="text-base font-semibold text-gray-900">Concept Reviewer</h1>
          <span />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            High-yield PL-300 concept refreshers with quick checks
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {ALL_CARDS.length} concepts · 6 categories · No timer
          </p>
        </div>

        {/* Weak areas banner */}
        {hasWeakAreas && (
          <button
            onClick={() => startSession(weakCards, 'Weak Area Refresher')}
            className="w-full bg-amber-50 border-2 border-amber-200 hover:border-amber-400 rounded-xl p-4 mb-6 text-left transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-800">Review Your Weak Areas</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {weakCards.length} targeted concept{weakCards.length !== 1 ? 's' : ''} based on your exam history
                </p>
              </div>
              <span className="text-amber-600 font-semibold text-sm flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                Start →
              </span>
            </div>
          </button>
        )}

        {!hasWeakAreas && history.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-800">No weak areas detected</p>
            <p className="text-xs text-green-600 mt-0.5">
              All domains above 70% — keep it up!
            </p>
          </div>
        )}

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CATEGORIES.map(cat => {
            const c = COLOR_MAP[cat.color]
            return (
              <button
                key={cat.id}
                onClick={() => startSession(cat.cards, cat.name)}
                className={`bg-white rounded-xl border-2 ${c.border} p-5 text-left hover:shadow-md transition-all group`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className={`text-sm font-semibold ${c.text}`}>{cat.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${c.badge}`}>
                    {cat.cards.length} cards
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-snug">{cat.description}</p>
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Concepts · Key insights · Common traps · Quick checks
        </p>
      </div>
    </div>
  )
}
