import { useEffect, useRef } from 'react'

export function useKeyboardNav({ onPrev, onNext, onSelectChoice, onFlag, enabled = true }) {
  const cbRef = useRef({})
  useEffect(() => {
    cbRef.current = { onPrev, onNext, onSelectChoice, onFlag }
  })

  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName ?? ''
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return

      const { onPrev, onNext, onSelectChoice, onFlag } = cbRef.current

      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev?.() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); onNext?.() }
      else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); onFlag?.() }
      else {
        const digit = parseInt(e.key, 10)
        if (digit >= 1 && digit <= 4) { e.preventDefault(); onSelectChoice?.(digit - 1) }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled])
}
