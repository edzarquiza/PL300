// Strips checkmark/cross annotations (e.g. "9,800 ✅ (latest balance)") that
// would otherwise point straight at the correct answer in Exam Mode.
export function stripAnswerMarkers(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/\s*←\s*answer\b/gi, '')
    .replace(/\s*[✅❌]\s*(\([^)]*\))?\s*(answer\b)?/gi, '')
    .trim()
}
