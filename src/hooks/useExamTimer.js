import { useState, useEffect, useRef } from 'react'

export function useExamTimer(durationSeconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const onExpireRef = useRef(onExpire)

  // Keep the ref up to date so the callback always closes over current state
  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current?.()
      return
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft])

  return timeLeft
}
