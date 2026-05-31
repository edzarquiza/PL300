// Final cleanup script: P8 wording improvements + balance check
// Run AFTER all background agents have completed

const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../src/data/questions.json')
let questions = JSON.parse(fs.readFileSync(filePath, 'utf8'))

// ── P8: Wording improvements (recall → scenario-based) ────────────────────

const wordingFixes = [
  {
    id: 10,
    question: 'A developer writes the DAX measure [Margin %] = [Profit] / [Revenue]. In some months, Revenue is zero and the measure returns a divide-by-zero error, breaking the report. Which function should replace the / operator to handle this gracefully?',
  },
  {
    id: 31,
    question: 'A data analyst is importing a 50,000-row customer CSV file and wants to quickly assess data completeness — specifically what percentage of each column\'s values are valid, contain errors, or are empty — before loading into the model. Which Power Query View option provides this?',
  },
  {
    id: 47,
    question: 'A regional sales manager wants a visual that lets them quickly compare total quarterly sales across five product categories side by side in a single view. Which visual type is MOST appropriate?',
  },
  {
    id: 50,
    question: 'A report consumer keeps accidentally selecting multiple regions in a slicer when they intend to select only one. The report author wants to enforce single-value selection so users cannot select multiple items simultaneously. Which setting should be configured?',
  },
]

let wordingFixed = 0
wordingFixes.forEach(({ id, question }) => {
  const q = questions.find(x => x.id === id)
  if (q && q.question !== question) {
    q.question = question
    wordingFixed++
    console.log(`Improved wording for Q${id}`)
  }
})

// ── Verify choiceExplanations coverage ────────────────────────────────────

const singles = questions.filter(q => q.type === 'single')
const withExp = singles.filter(q => q.choiceExplanations)
const missing = singles.filter(q => !q.choiceExplanations)
console.log(`\nchoiceExplanations: ${withExp.length}/${singles.length} (${Math.round(withExp.length/singles.length*100)}%)`)
if (missing.length > 0) {
  console.log('Still missing:', missing.map(q => q.id).join(','))
}

// ── Answer distribution check ──────────────────────────────────────────────

const dist = { 0:0, 1:0, 2:0, 3:0 }
singles.forEach(q => { if (q.correctAnswers) dist[q.correctAnswers[0]]++ })
console.log('Answer distribution:', dist)

// ── Difficulty check ───────────────────────────────────────────────────────

const diff = {}
questions.forEach(q => { diff[q.difficulty] = (diff[q.difficulty]||0)+1 })
console.log('Difficulty:', diff, '| Hard %:', Math.round(diff.Hard/questions.length*100) + '%')

// ── Domain counts ──────────────────────────────────────────────────────────

const domains = {}
questions.forEach(q => { domains[q.domain] = (domains[q.domain]||0)+1 })
console.log('Domains:', domains)
console.log('Total questions:', questions.length)

// ── Save ───────────────────────────────────────────────────────────────────

fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))
console.log(`\nSaved. ${wordingFixed} wording fixes applied.`)
