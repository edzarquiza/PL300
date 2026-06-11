import { useState } from 'react'
import { isAnswerEmpty, isAnswerCorrect } from '../utils/answerUtils'
import QuestionRenderer from './question-types/QuestionRenderer'
import VisualQuestionContext from './VisualQuestionContext'
import SampleDataTable from './SampleDataTable'
import ResultTable from './ResultTable'
import { addToRetryQueue, removeFromRetryQueue, isInRetryQueue } from '../services/retryQueueService'
import { formatTime } from '../utils/examUtils'
import { DAX_FUNCTIONS } from '../data/daxFunctions'
import { getWalkthroughForTags } from '../data/walkthroughs'
import WalkthroughViewer from './WalkthroughViewer'

const DAX_MAP = Object.fromEntries(
  DAX_FUNCTIONS.map(fn => [fn.functionName.toUpperCase(), fn])
)

const TYPE_LABEL = {
  multi:           'Multiple choice',
  true_false:      'True or False',
  drag_drop:       'Drag & Drop',
  rearrange_steps: 'Arrange in Order',
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E']

const CONFIDENCE_MAP = {
  very_unsure:    { label: 'Very Unsure',   cls: 'bg-gray-100 text-gray-500' },
  unsure:         { label: 'Unsure',         cls: 'bg-gray-100 text-gray-500' },
  neutral:        { label: 'Neutral',        cls: 'bg-gray-100 text-gray-600' },
  confident:      { label: 'Confident',      cls: 'bg-blue-100 text-blue-700' },
  very_confident: { label: 'Very Confident', cls: 'bg-blue-100 text-blue-800' },
}

function getSeverity(question, confidenceLevel) {
  const highConf = confidenceLevel === 'confident' || confidenceLevel === 'very_confident'
  if (question.trapType && highConf) return { label: 'High Risk', cls: 'bg-red-100 text-red-700 border-red-200' }
  if (question.trapType)            return { label: 'Moderate',  cls: 'bg-amber-100 text-amber-700 border-amber-200' }
  return                                   { label: 'Minor',     cls: 'bg-gray-100 text-gray-500 border-gray-200' }
}

function CollapseSection({ title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors text-left"
      >
        {title}
        <span className="flex-shrink-0 ml-2 text-gray-300">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  )
}

function MistakeAnalysis({ question, userAnswer }) {
  const correctIdx = question.correctAnswers?.[0]
  if (typeof userAnswer !== 'number' || typeof correctIdx !== 'number') return null

  const wrongExp   = question.choiceExplanations?.[userAnswer]   ?? question.choiceExplanations?.[String(userAnswer)]
  const correctExp = question.choiceExplanations?.[correctIdx] ?? question.choiceExplanations?.[String(correctIdx)]

  return (
    <div className="space-y-2.5">
      <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs">
        <span className="flex-shrink-0 font-bold text-red-600 mt-0.5">{CHOICE_LABELS[userAnswer]}.</span>
        <span className="flex-1 leading-snug text-gray-800">{question.choices[userAnswer]}</span>
        <span className="flex-shrink-0 text-red-500 font-semibold ml-2 whitespace-nowrap">✗ your pick</span>
      </div>
      {wrongExp && (
        <p className="text-xs text-red-800 leading-relaxed bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <span className="font-semibold">Why this is wrong: </span>{wrongExp}
        </p>
      )}
      <div className="flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs">
        <span className="flex-shrink-0 font-bold text-green-700 mt-0.5">{CHOICE_LABELS[correctIdx]}.</span>
        <span className="flex-1 leading-snug text-gray-800">{question.choices[correctIdx]}</span>
        <span className="flex-shrink-0 text-green-600 font-semibold ml-2 whitespace-nowrap">✓ correct</span>
      </div>
      {correctExp && (
        <p className="text-xs text-green-900 leading-relaxed bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
          <span className="font-semibold">Why this is best: </span>{correctExp}
        </p>
      )}
    </div>
  )
}

function DaxReferencePanel({ question }) {
  const tags = question.tags ?? []
  const fn = tags.map(t => DAX_MAP[t.toUpperCase()]).find(Boolean)
  if (!fn) return null

  const example = fn.examples?.[0]

  return (
    <CollapseSection title={`DAX Reference: ${fn.functionName}`} defaultOpen={false}>
      <div className="space-y-3">

        {/* Syntax */}
        <div className="bg-gray-900 rounded-lg px-3 py-2.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Syntax</p>
          <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
            {fn.syntax}
          </pre>
        </div>

        {/* Summary */}
        <p className="text-xs text-gray-600 leading-relaxed">{fn.summary}</p>

        {/* Parameters */}
        {fn.parameters?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Parameters</p>
            <div className="space-y-2">
              {fn.parameters.map(p => (
                <div key={p.name} className="flex items-start gap-2.5 text-xs">
                  <code className={`flex-shrink-0 font-mono px-1.5 py-0.5 rounded text-xs ${
                    p.required ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.name}
                  </code>
                  <span className="text-gray-600 leading-snug">
                    {p.description}
                    {p.examNote && (
                      <span className="block text-amber-600 mt-0.5">{p.examNote}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example */}
        {example && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{example.label}</p>
            <div className="bg-gray-900 rounded-lg px-3 py-2.5 mb-2">
              <pre className="text-xs text-amber-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                {example.expression}
              </pre>
            </div>
            {example.sampleData?.tables?.map(t => (
              <div key={t.name} className="mb-2">
                <SampleDataTable table={t} />
              </div>
            ))}
            {example.expectedOutput && <ResultTable output={example.expectedOutput} revealAnswers />}
            {example.explanation && (
              <p className="text-xs text-gray-600 leading-relaxed mt-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                {example.explanation}
              </p>
            )}
          </div>
        )}

        {/* Common traps */}
        {fn.commonTraps?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Exam Traps</p>
            <ul className="space-y-1.5">
              {fn.commonTraps.map((trap, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-900">
                  <span className="flex-shrink-0 text-amber-500 font-bold mt-0.5">!</span>
                  <span className="leading-relaxed">{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CollapseSection>
  )
}

export default function ReviewCard({ question, userAnswer, questionNumber, confidenceLevel = null, timeSpent = 0 }) {
  const isEmpty   = isAnswerEmpty(userAnswer, question)
  const isCorrect = !isEmpty && isAnswerCorrect(userAnswer, question)
  const [inQueue, setInQueue] = useState(() => isInRetryQueue(question.id))
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const walkthrough = getWalkthroughForTags(question.tags ?? [])

  function toggleRetry() {
    if (inQueue) { removeFromRetryQueue(question.id); setInQueue(false) }
    else         { addToRetryQueue(question.id);      setInQueue(true)  }
  }

  const severity = (!isCorrect && !isEmpty) ? getSeverity(question, confidenceLevel) : null
  const confCfg  = confidenceLevel ? CONFIDENCE_MAP[confidenceLevel] : null

  const showMistakeSection  = !isCorrect && !isEmpty &&
    question.type === 'single' && typeof userAnswer === 'number' && question.choiceExplanations

  const defaultOpenExplanation = !isCorrect && !isEmpty

  return (
    <div className={`bg-white rounded-xl border-2 overflow-hidden ${
      isEmpty ? 'border-gray-200' : isCorrect ? 'border-green-200' : 'border-red-200'
    }`}>

      {/* Card header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-400">Q{questionNumber}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {question.subtopic}
            </span>
            <span className="text-xs text-gray-400">{question.difficulty}</span>
            {TYPE_LABEL[question.type] && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                {TYPE_LABEL[question.type]}
              </span>
            )}
            {question.type === 'multi_part' && (
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
                {question.parts?.length ?? 0}-Part
              </span>
            )}
          </div>
          <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isEmpty   ? 'bg-gray-100 text-gray-500' :
            isCorrect ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
          }`}>
            {isEmpty ? 'Not answered' : isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </span>
        </div>

        {/* Metadata row: severity, confidence, time, trap */}
        {(severity || confCfg || timeSpent > 0 || question.trapType) && (
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {severity && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${severity.cls}`}>
                {severity.label}
              </span>
            )}
            {confCfg && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${confCfg.cls}`}>
                {confCfg.label} confidence
              </span>
            )}
            {timeSpent > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {formatTime(timeSpent)}
              </span>
            )}
            {question.trapType && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                Trap: {question.trapType}
              </span>
            )}
          </div>
        )}

        <VisualQuestionContext question={question} revealAnswers />

        <p className="text-sm font-medium text-gray-900 leading-relaxed mb-4">
          {question.question}
        </p>

        <QuestionRenderer
          question={question}
          answer={userAnswer}
          onAnswer={() => {}}
          isReviewMode={true}
        />
      </div>

      {/* Expandable: Mistake Analysis (auto-open for wrong single-choice with choiceExplanations) */}
      {showMistakeSection && (
        <CollapseSection title="Mistake Analysis" defaultOpen={true}>
          <MistakeAnalysis question={question} userAnswer={userAnswer} />
        </CollapseSection>
      )}

      {/* Expandable: Explanation (auto-open for wrong answers) */}
      {question.type !== 'multi_part' && question.explanation && (
        <CollapseSection title="Explanation" defaultOpen={defaultOpenExplanation}>
          <p className="text-xs text-gray-700 leading-relaxed">{question.explanation}</p>
        </CollapseSection>
      )}

      {/* Expandable: Related Concepts */}
      {question.tags?.length > 0 && (
        <CollapseSection title="Related Concepts" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {question.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </CollapseSection>
      )}

      {/* Expandable: DAX Reference (syntax + params + example + traps) */}
      <DaxReferencePanel question={question} />

      {/* Expandable: Visual Walkthrough */}
      {walkthrough && (
        <CollapseSection
          title={`▶ Visual Walkthrough — ${walkthrough.concept}`}
          defaultOpen={false}
        >
          <WalkthroughViewer walkthrough={walkthrough} />
        </CollapseSection>
      )}

      {/* Retry footer */}
      {!isCorrect && !isEmpty && (
        <div className="border-t border-gray-100 px-5 py-3 flex justify-end bg-gray-50/60">
          <button
            onClick={toggleRetry}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              inQueue
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {inQueue ? '✓ Queued for Retry' : '+ Retry Later'}
          </button>
        </div>
      )}
    </div>
  )
}
