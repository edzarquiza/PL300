import { formatTime } from '../utils/examUtils'

export default function Timer({ timeLeft }) {
  const isCritical = timeLeft <= 60
  const isWarning = timeLeft <= 300

  return (
    <span
      className={`text-sm font-mono font-semibold tabular-nums ${
        isCritical
          ? 'text-red-600 animate-pulse'
          : isWarning
          ? 'text-amber-500'
          : 'text-gray-600'
      }`}
    >
      {formatTime(timeLeft)}
    </span>
  )
}
