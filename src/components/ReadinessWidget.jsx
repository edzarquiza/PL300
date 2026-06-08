import { useMemo } from 'react'
import { computeReadiness } from '../services/readinessService'
import allQuestions from '../data/questions.json'

const SCORE_COLORS = {
  high:   { ring: '#22c55e', text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  label: 'text-green-700'  },
  mid:    { ring: '#3b82f6', text: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   label: 'text-blue-700'   },
  warn:   { ring: '#f59e0b', text: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  label: 'text-amber-700'  },
  low:    { ring: '#ef4444', text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    label: 'text-red-700'    },
}

function getScheme(score) {
  if (score >= 85) return SCORE_COLORS.high
  if (score >= 70) return SCORE_COLORS.mid
  if (score >= 55) return SCORE_COLORS.warn
  return SCORE_COLORS.low
}

const TREND_ICON = { improving: '↑', declining: '↓', stable: '→' }
const TREND_COLOR = { improving: 'text-green-600', declining: 'text-red-500', stable: 'text-gray-400' }

// Circular progress SVG (r=38, so circumference ≈ 239)
function ScoreRing({ score, color }) {
  const r   = 38
  const circ = 2 * Math.PI * r
  const dash = circ * (score / 100)

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="block">
      {/* Track */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
      {/* Progress */}
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}   // start at top
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}

export default function ReadinessWidget() {
  const data = useMemo(() => computeReadiness(allQuestions), [])

  if (!data) return null   // no exam history yet

  const scheme = getScheme(data.score)

  return (
    <div className={`rounded-xl border ${scheme.border} ${scheme.bg} p-5 mb-5`}>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          PL-300 Readiness Estimate
        </p>
        <span className={`text-xs font-semibold ${TREND_COLOR[data.trend]}`}>
          {TREND_ICON[data.trend]} {data.trend}
        </span>
      </div>

      {/* Score + label */}
      <div className="flex items-center gap-5 mb-4">
        <div className="relative flex-shrink-0">
          <ScoreRing score={data.score} color={scheme.ring} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold leading-none ${scheme.text}`}>{data.score}</span>
            <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-base font-bold ${scheme.label}`}>{data.label}</p>
          <p className="text-xs text-gray-500 mt-1 leading-snug">{data.recommendation}</p>
          <div className="flex gap-3 mt-2 text-xs text-gray-400">
            <span>{data.examsTaken} exam{data.examsTaken !== 1 ? 's' : ''} taken</span>
            <span>·</span>
            <span>Avg {data.avgScorePct}%</span>
            <span>·</span>
            <span>{data.coveragePct}% bank seen</span>
          </div>
        </div>
      </div>

      {/* Strong + Risk rows */}
      <div className="grid grid-cols-2 gap-3">

        {data.strongAreas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-700 mb-1.5">Strong</p>
            <ul className="space-y-1">
              {data.strongAreas.map(a => (
                <li key={a} className="flex items-start gap-1 text-xs text-green-800">
                  <span className="mt-0.5 text-green-500 flex-shrink-0">✓</span>
                  <span className="leading-tight">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.riskAreas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-700 mb-1.5">Risk Areas</p>
            <ul className="space-y-1">
              {data.riskAreas.map(a => (
                <li key={a} className="flex items-start gap-1 text-xs text-red-800">
                  <span className="mt-0.5 text-red-500 flex-shrink-0">⚠</span>
                  <span className="leading-tight">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Domain bar chart */}
      {data.domainAvgs.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-3 space-y-2">
          {data.domainAvgs.map(({ domain, avg }) => {
            const barColor = avg >= STRONG_THRESHOLD ? 'bg-green-500' : avg >= 70 ? 'bg-blue-500' : avg >= RISK_THRESHOLD ? 'bg-amber-500' : 'bg-red-500'
            const label    = domain.length > 32 ? domain.slice(0, 30) + '…' : domain
            return (
              <div key={domain}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">{label}</span>
                  <span className={`font-semibold ${avg >= 70 ? 'text-green-700' : avg >= RISK_THRESHOLD ? 'text-amber-700' : 'text-red-700'}`}>{avg}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${avg}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
