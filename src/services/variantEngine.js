const SEEN_KEY = 'pl300_seen_questions'
// Keep the most recent 200 seen question IDs to drive rotation.
const MAX_SEEN = 200

export function getSeenQuestionIds() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

export function recordSeenQuestions(ids) {
  try {
    const existing = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')
    const updated = [...new Set([...ids, ...existing])].slice(0, MAX_SEEN)
    localStorage.setItem(SEEN_KEY, JSON.stringify(updated))
  } catch {}
}

export function clearSeenQuestions() {
  localStorage.removeItem(SEEN_KEY)
}

// Group pool by questionGroupId, then pick the least-recently-seen variant per group.
// Falls back to any random variant if all have been seen.
export function selectVariants(pool) {
  const seen = getSeenQuestionIds()
  const groups = {}

  for (const q of pool) {
    const gid = q.questionGroupId ?? `_solo_${q.id}`
    if (!groups[gid]) groups[gid] = []
    groups[gid].push(q)
  }

  return Object.values(groups).map(variants => {
    const unseen = variants.filter(v => !seen.has(v.id))
    const candidates = unseen.length > 0 ? unseen : variants
    return candidates[Math.floor(Math.random() * candidates.length)]
  })
}

// Fill {variable} placeholders in question text, choices, and explanation
// using randomly-chosen values from question.scenarioVariables.
export function renderScenario(question) {
  if (!question.scenarioVariables) return question

  const vars = {}
  for (const [key, options] of Object.entries(question.scenarioVariables)) {
    vars[key] = options[Math.floor(Math.random() * options.length)]
  }

  return {
    ...question,
    question: fill(question.question, vars),
    choices: question.choices.map(c => fill(c, vars)),
    explanation: fill(question.explanation, vars),
    _renderedVars: vars,
  }
}

function fill(text, vars) {
  return text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}
