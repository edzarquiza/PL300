const fs = require('fs')
const path = require('path')

const ms = require('../src/data/microsoftPracticeAssessment.json')
const text = fs.readFileSync(path.join(__dirname, '..', 'MS PL300 Exam wordings.txt'), 'utf8')
const lines = text.split(/\r?\n/)

// For each question with <3 choices, find ALL occurrences in the source file
// and take the one with the most choices + answer markers

function findAllOccurrences(questionText) {
  const searchPrefix = questionText.substring(0, 60).toLowerCase().replace(/\s+/g, ' ')
  const occurrences = []

  let i = 0
  while (i < lines.length) {
    if (!/Question \d+ of 50/.test(lines[i])) { i++; continue }
    i++

    while (i < lines.length && lines[i].trim() === '') i++

    let qText = ''
    while (i < lines.length &&
           !lines[i].startsWith('Select only one answer') &&
           !lines[i].startsWith('Select all answers')) {
      qText += lines[i] + '\n'
      i++
    }
    qText = qText.trim()

    const normalQ = qText.substring(0, 60).toLowerCase().replace(/\s+/g, ' ')
    if (!normalQ.startsWith(searchPrefix.substring(0, 40))) { i++; continue }

    // Parse selection type
    let selType = 'single'
    if (i < lines.length && lines[i].includes('Select all answers')) selType = 'multi'
    i++

    while (i < lines.length && lines[i].trim() === '') i++

    // Parse choices
    const choices = []
    let hasAnswer = false
    let explanationLines = []
    let collectingExpl = false

    while (i < lines.length) {
      const line = lines[i].trim()
      if (/^Practice Assessment for Exam PL-300/.test(line)) break
      if (/^Question \d+ of 50/.test(line)) break

      if (line === 'This answer is correct.') {
        if (choices.length > 0) choices[choices.length - 1].correct = true
        hasAnswer = true; i++; continue
      }
      if (line === 'This answer is incorrect.') {
        if (choices.length > 0) choices[choices.length - 1].correct = false
        hasAnswer = true; i++; continue
      }

      if (/Microsoft Learn|microsoft\.com|learn\.microsoft\.com/i.test(line) && !line.startsWith('You')) {
        i++; continue
      }
      if (['AI Disclaimer', 'Previous Versions', 'Blog', 'Contribute', 'Privacy'].includes(line)) {
        i++; continue
      }

      if (hasAnswer && choices.length >= 2 && (line.length > 40 || collectingExpl)) {
        collectingExpl = true
        if (line !== '') explanationLines.push(line)
        i++; continue
      }

      if (line === '') { i++; continue }
      if (!collectingExpl) {
        choices.push({ text: line, correct: null })
      }
      i++
    }

    occurrences.push({
      choices,
      hasAnswer,
      selType,
      explanation: explanationLines.join(' ').trim(),
    })
  }

  return occurrences
}

let fixed = 0
for (const q of ms) {
  if (q.choices.length >= 3) continue

  const occurrences = findAllOccurrences(q.question)
  if (occurrences.length === 0) {
    console.log('SKIP Q' + q.id + ': no occurrences found in source')
    continue
  }

  // Pick occurrence with most choices that has answers
  const best = occurrences
    .filter(o => o.hasAnswer)
    .sort((a, b) => b.choices.length - a.choices.length)[0]
    || occurrences.sort((a, b) => b.choices.length - a.choices.length)[0]

  if (best.choices.length <= q.choices.length) {
    console.log('SKIP Q' + q.id + ': best occurrence also has ' + best.choices.length + ' choices')
    continue
  }

  // Update choices and correctAnswers
  q.choices = best.choices.map(c => c.text)
  q.correctAnswers = best.choices
    .map((c, i) => c.correct === true ? i : -1)
    .filter(i => i >= 0)

  if (q.correctAnswers.length === 0) {
    // Fall back to finding correct by matching old correct text
    console.log('WARN Q' + q.id + ': no correct markers in best occurrence')
    continue
  }

  if (best.explanation && best.explanation.length > q.explanation.length) {
    q.explanation = best.explanation
  }

  console.log('FIXED Q' + q.id + ': ' + q.choices.length + ' choices, ' + q.correctAnswers.length + ' correct')
  fixed++
}

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'microsoftPracticeAssessment.json'),
  JSON.stringify(ms, null, 2),
  'utf8'
)

console.log('\nFixed ' + fixed + ' questions')

// Re-check
let remaining = 0
for (const q of ms) {
  if (q.choices.length < 3) {
    console.log('STILL SHORT Q' + q.id + ': ' + q.choices.length + ' choices - ' + q.question.substring(0, 50))
    remaining++
  }
}
console.log('Remaining with <3 choices:', remaining)
