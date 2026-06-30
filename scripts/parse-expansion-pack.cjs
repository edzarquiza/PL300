const fs = require('fs')
const path = require('path')

const raw = fs.readFileSync(path.join(__dirname, '..', 'PL300_Microsoft_Expansion_Pack.txt'), 'utf8')
const blocks = raw.split(/\n(?=Question \d+\n)/).filter(b => /^Question \d+\n/.test(b))

const KNOWN_DOMAINS = [
  'Visualize and analyze the data',
  'Prepare the data',
  'Model the data',
  'Deploy and maintain assets',
  'Integrated Scenario',
]

function parseBlock(block) {
  const m = block.match(/^Question (\d+)\n/)
  const id = parseInt(m[1])
  let rest = block.slice(m[0].length)

  // Strip trailing separator
  rest = rest.replace(/-{5,}\s*$/m, '').trim()

  const lines = rest.split('\n')
  let i = 0
  while (lines[i] === '') i++

  // Optional domain/difficulty header (1-2 short lines, no period, not "A." choices)
  let domainHeader = null
  let difficultyHeader = null
  if (KNOWN_DOMAINS.includes(lines[i]?.trim())) {
    domainHeader = lines[i].trim()
    i++
    if (/^(Easy|Medium|Hard)$/.test(lines[i]?.trim())) {
      difficultyHeader = lines[i].trim()
      i++
    }
  }
  while (lines[i] === '') i++

  // Collect question text until we hit a line starting with "A. " (with or without other choices inline)
  const qLines = []
  while (i < lines.length && !/^A\.\s/.test(lines[i])) {
    qLines.push(lines[i])
    i++
  }
  // Collapse mid-sentence hard-wraps (single newline) into spaces while
  // preserving intentional paragraph breaks (blank-line-separated).
  let questionText = qLines
    .join('\n')
    .split(/\n{2,}/)
    .map(para => para.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim())
    .join('\n\n')
    .trim()
  // Reformat inline "X: - a, - b, - c" lists into proper bullet lines.
  questionText = questionText
    .replace(/:\s*-\s+/g, ':\n- ')
    .replace(/,\s*-\s+/g, ',\n- ')

  // Choices: from here until "Answer:" line
  const choiceLines = []
  while (i < lines.length && !/^Answer:/.test(lines[i])) {
    if (lines[i].trim() !== '') choiceLines.push(lines[i].trim())
    i++
  }
  const choiceBlob = choiceLines.join(' ')
  // Split on " X. " patterns for X = A-E, anchored so the letter is a new choice marker
  const choiceMatches = [...choiceBlob.matchAll(/([A-E])\.\s*(.*?)(?=\s[A-E]\.\s|$)/g)]
  const choices = choiceMatches.map(cm => cm[2].trim())

  // Answer line
  const answerLine = lines[i] || ''
  const answerMatch = answerLine.match(/^Answer:\s*([A-E])/)
  const answerLetter = answerMatch ? answerMatch[1] : null
  i++

  // Explanation (optional)
  while (lines[i] === '') i++
  let explanation = lines.slice(i).join('\n').trim()
  // Strip a leading "Explanation" header token, whether on its own line
  // or immediately followed by the explanation text on the same line.
  explanation = explanation.replace(/^Explanation\b\s*/, '')
  // At major batch boundaries the source omits the "----" separator before
  // the next section's "PL-300 Microsoft Practice Assessment Expansion"
  // title block, so it bleeds into the prior question's trailing content.
  explanation = explanation.split(/PL-300 Microsoft Practice Assessment Expansion/)[0]
  // Clean up bullet formatting -> plain sentences
  explanation = explanation
    .replace(/\n+/g, ' ')
    .replace(/-\s+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

  const letterIdx = { A: 0, B: 1, C: 2, D: 3, E: 4 }
  const correctAnswers = answerLetter !== null ? [letterIdx[answerLetter]] : []

  return {
    id,
    domainHeader,
    difficultyHeader,
    question: questionText,
    choices,
    correctAnswers,
    explanation,
  }
}

const parsed = blocks.map(parseBlock)

// Sanity report
let bad = 0
for (const q of parsed) {
  if (q.choices.length < 3 || q.correctAnswers.length === 0 || !q.question) {
    console.log('ISSUE Q' + q.id + ':', 'choices=' + q.choices.length, 'correct=' + q.correctAnswers.length, 'qlen=' + q.question.length)
    bad++
  }
}
console.log('Total parsed:', parsed.length, 'Issues:', bad)

fs.writeFileSync(
  path.join(__dirname, 'expansion-pack-parsed.json'),
  JSON.stringify(parsed, null, 2),
  'utf8'
)
console.log('Wrote scripts/expansion-pack-parsed.json')
