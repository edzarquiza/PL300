// 1. Adds the missing DirectLake question (ID 264)
// 2. Redistributes answer positions from all-A toward balanced A/B/C/D

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../src/data/questions.json')
let questions = JSON.parse(fs.readFileSync(filePath, 'utf8'))

// ── 1. Add missing DirectLake question ────────────────────────────────────────

const directLakeQ = {
  id: 264,
  type: 'single',
  domain: 'Prepare the data',
  subtopic: 'Choose between DirectLake, DirectQuery, and Import',
  difficulty: 'Hard',
  questionStyle: 'scenario',
  cognitiveLevel: 'analysis',
  examObjective: 'Prepare the data > Get or connect to data',
  commonTrap: 'Confusing DirectLake with DirectQuery when working with Microsoft Fabric',
  trapType: 'DirectLake vs DirectQuery vs Import',
  question: 'A company uses Microsoft Fabric and stores all analytical data in a Lakehouse (OneLake Delta tables). The team requires near-real-time data freshness and needs to query very large fact tables (500M+ rows) without scheduled refreshes or hours-long import cycles. Which storage mode is MOST appropriate for this scenario?',
  choices: [
    'DirectLake — reads column data directly from Delta Parquet files in OneLake, providing near-Import query performance without a data copy or traditional DirectQuery overhead',
    'Import — loads all 500M rows nightly into the Analysis Services in-memory engine for fastest daytime query performance',
    'DirectQuery via the Lakehouse SQL endpoint — sends every visual query live to the Lakehouse for true real-time data access',
    'Composite mode — Import for dimension tables and DirectQuery for the 500M-row fact table to balance freshness and performance'
  ],
  correctAnswers: [0],
  explanation: 'DirectLake is purpose-built for Microsoft Fabric Lakehouse scenarios. It reads Delta Parquet column segments directly from OneLake without copying data into the engine or sending live SQL queries. This delivers near-Import in-memory query performance while automatically reflecting data changes in the Lakehouse as they occur — eliminating the scheduled refresh cycle. Import requires hours-long refresh for 500M rows; DirectQuery is slower for complex analytical DAX; Composite is a workaround that DirectLake supersedes in Fabric.',
  estimatedTimeSeconds: 120,
  tags: ['DirectLake', 'Microsoft Fabric', 'OneLake', 'Delta Tables', 'Storage Modes'],
  choiceExplanations: {
    '0': 'Correct. DirectLake is the storage mode designed for Fabric Lakehouse. It reads Parquet column files from OneLake directly, providing query performance comparable to Import without a data copy or refresh window.',
    '1': 'Importing 500M rows requires enormous storage, very long refresh windows (hours), and a full reload for data changes. This fails the near-real-time freshness requirement entirely.',
    '2': 'DirectQuery via the SQL endpoint routes every Power BI visual interaction as a SQL query to the Lakehouse. For complex DAX measures over 500M rows, this is much slower than DirectLake which reads column files in memory.',
    '3': 'Composite mode mixing Import + DirectQuery is a valid pattern for traditional on-premises/cloud scenarios. In Microsoft Fabric, DirectLake is the preferred and superior approach — it achieves what Composite mode tries to do, more efficiently.'
  },
  questionGroupId: 'storage_modes_fabric',
  variantId: 'fabric_lakehouse_02'
}

questions.push(directLakeQ)
console.log('Added DirectLake question (ID 264)')

// ── 2. Redistribute answer positions ─────────────────────────────────────────

function swapToTarget(q, targetPos) {
  const currentPos = q.correctAnswers[0]
  if (currentPos === targetPos) return false

  // Swap choices
  const choices = [...q.choices]
  ;[choices[currentPos], choices[targetPos]] = [choices[targetPos], choices[currentPos]]

  // Rebuild choiceExplanations with swapped keys
  const oldExp = q.choiceExplanations || {}
  const newExp = {}
  Object.entries(oldExp).forEach(([k, v]) => {
    const ki = parseInt(k)
    if (ki === currentPos) newExp[String(targetPos)] = v
    else if (ki === targetPos) newExp[String(currentPos)] = v
    else newExp[k] = v
  })

  q.choices = choices
  q.correctAnswers = [targetPos]
  q.choiceExplanations = newExp
  return true
}

// Count current distribution on single-choice questions
const singles = questions.filter(q => q.type === 'single')
const dist = { 0: 0, 1: 0, 2: 0, 3: 0 }
singles.forEach(q => { if (q.correctAnswers) dist[q.correctAnswers[0]]++ })
console.log('Before redistribution:', dist, '(', singles.length, 'single-choice)')

const target = Math.round(singles.length / 4)
console.log(`Target per position: ~${target}`)

// Strategy: move newly added questions (ID >= 230) first since they're all pos 0
// Then move older pos-0 questions if still needed
const newOnes = questions.filter(q => q.type === 'single' && q.id >= 230 && q.correctAnswers[0] === 0)
  .sort((a, b) => a.id - b.id)

const targets = [
  { pos: 1, count: Math.max(0, target - dist[1]) },
  { pos: 2, count: Math.max(0, target - dist[2]) },
  { pos: 3, count: Math.max(0, target - dist[3]) },
]

let pointer = 0
let totalMoved = 0
for (const { pos, count } of targets) {
  let moved = 0
  while (moved < count && pointer < newOnes.length) {
    const q = newOnes[pointer++]
    const actual = questions.find(x => x.id === q.id)
    if (actual && actual.correctAnswers[0] === 0) {
      swapToTarget(actual, pos)
      moved++
      totalMoved++
    }
  }
  console.log(`Moved ${moved} questions to position ${pos}`)
}

// If we still need more, pull from old pos-0 questions
const dist2 = { 0: 0, 1: 0, 2: 0, 3: 0 }
questions.filter(q => q.type === 'single' && q.correctAnswers).forEach(q => { dist2[q.correctAnswers[0]]++ })

for (const { pos } of targets) {
  const stillNeeded = Math.max(0, target - dist2[pos])
  if (stillNeeded > 0) {
    const oldPos0 = questions.filter(q => q.type === 'single' && q.id < 230 && q.correctAnswers[0] === 0)
    let moved = 0
    for (const q of oldPos0) {
      if (moved >= stillNeeded) break
      swapToTarget(q, pos)
      moved++
      totalMoved++
    }
    console.log(`Moved ${moved} more old questions to position ${pos}`)
  }
}

// Final distribution
const distFinal = { 0: 0, 1: 0, 2: 0, 3: 0 }
questions.filter(q => q.type === 'single' && q.correctAnswers).forEach(q => { distFinal[q.correctAnswers[0]]++ })
console.log('After redistribution:', distFinal, '(total moved:', totalMoved, ')')

fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))
console.log(`\nquestions.json saved: ${questions.length} total questions`)

const domains = {}
questions.forEach(q => { domains[q.domain] = (domains[q.domain] || 0) + 1 })
console.log('Domain counts:', domains)
