import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const questions = JSON.parse(readFileSync(join(__dirname, '../src/data/questions.json'), 'utf8'))

const REQUIRED = ['id', 'type', 'domain', 'subtopic', 'difficulty', 'question', 'choices', 'correctAnswers', 'explanation', 'tags']
const VALID_DOMAINS = ['Prepare the data', 'Model the data', 'Visualize and analyze the data', 'Manage and secure Power BI']
const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const VALID_TYPES = ['single', 'multi']

const issues = []
const ids = new Set()
const questionTexts = new Map()

for (const q of questions) {
  const loc = `ID ${q.id}`

  // Duplicate IDs
  if (ids.has(q.id)) issues.push(`${loc}: DUPLICATE ID`)
  ids.add(q.id)

  // Duplicate question text
  const key = q.question?.trim().toLowerCase()
  if (key) {
    if (questionTexts.has(key)) issues.push(`${loc}: DUPLICATE QUESTION TEXT (same as ID ${questionTexts.get(key)})`)
    else questionTexts.set(key, q.id)
  }

  // Required fields
  for (const f of REQUIRED) {
    if (q[f] === undefined || q[f] === null || q[f] === '') {
      issues.push(`${loc}: MISSING required field "${f}"`)
    }
  }

  // Domain
  if (q.domain && !VALID_DOMAINS.includes(q.domain)) {
    issues.push(`${loc}: INVALID domain "${q.domain}"`)
  }

  // Difficulty
  if (q.difficulty && !VALID_DIFFICULTIES.includes(q.difficulty)) {
    issues.push(`${loc}: INVALID difficulty "${q.difficulty}"`)
  }

  // Type
  if (q.type && !VALID_TYPES.includes(q.type)) {
    issues.push(`${loc}: INVALID type "${q.type}"`)
  }

  // Choices
  if (!Array.isArray(q.choices) || q.choices.length < 2) {
    issues.push(`${loc}: choices must have at least 2 items (has ${q.choices?.length ?? 0})`)
  }

  // correctAnswers
  if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
    issues.push(`${loc}: correctAnswers must be a non-empty array`)
  } else {
    for (const idx of q.correctAnswers) {
      if (typeof idx !== 'number' || idx < 0 || idx >= (q.choices?.length ?? 0)) {
        issues.push(`${loc}: correctAnswers[${idx}] out of range (choices length: ${q.choices?.length})`)
      }
    }
  }

  // Tags
  if (!Array.isArray(q.tags) || q.tags.length === 0) {
    issues.push(`${loc}: tags must be a non-empty array`)
  }

  // Explanation should not be empty
  if (typeof q.explanation === 'string' && q.explanation.trim().length < 10) {
    issues.push(`${loc}: explanation is suspiciously short`)
  }
}

// Domain distribution
const domainCounts = {}
for (const q of questions) {
  domainCounts[q.domain] = (domainCounts[q.domain] || 0) + 1
}

// Difficulty distribution
const diffCounts = {}
for (const q of questions) {
  diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1
}

// Per-batch stats (IDs 1-280, 281-360, 361-427)
const batch0 = questions.filter(q => q.id <= 280)
const batch1 = questions.filter(q => q.id >= 281 && q.id <= 360)
const batch2 = questions.filter(q => q.id >= 361)

console.log('\n═══════════════════════════════════════')
console.log('  PL-300 Question Bank Quality Report')
console.log('═══════════════════════════════════════')
console.log(`\nTotal questions: ${questions.length}`)
console.log(`  Original bank (1–280):   ${batch0.length}`)
console.log(`  Batch 1 (281–360):       ${batch1.length}  [images 69–148]`)
console.log(`  Batch 2 (361–427):       ${batch2.length}  [images 1–68]`)

console.log('\n─── Domain Distribution ───')
for (const [domain, count] of Object.entries(domainCounts).sort((a,b) => b[1]-a[1])) {
  const pct = ((count / questions.length) * 100).toFixed(1)
  const bar = '█'.repeat(Math.round(pct / 2))
  console.log(`  ${domain.padEnd(38)} ${String(count).padStart(3)}  ${pct}%  ${bar}`)
}

console.log('\n─── Difficulty Distribution ───')
for (const [diff, count] of Object.entries(diffCounts).sort()) {
  const pct = ((count / questions.length) * 100).toFixed(1)
  console.log(`  ${diff.padEnd(10)} ${String(count).padStart(3)}  ${pct}%`)
}

console.log('\n─── Batch 2 Domain Breakdown (IDs 361–427) ───')
const b2domains = {}
for (const q of batch2) b2domains[q.domain] = (b2domains[q.domain] || 0) + 1
for (const [d, c] of Object.entries(b2domains).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${d.padEnd(38)} ${c}`)
}

console.log(`\n─── Issues Found: ${issues.length} ───`)
if (issues.length === 0) {
  console.log('  ✅ No issues found!')
} else {
  for (const issue of issues) console.log(`  ⚠️  ${issue}`)
}
console.log()
