const fs = require('fs')
const path = require('path')

const parsed = require('./expansion-pack-parsed.json')
const explanations = require('./expansion-pack-explanations.json')
const metadata = require('./expansion-pack-metadata.json')
const msPath = path.join(__dirname, '..', 'src', 'data', 'microsoftPracticeAssessment.json')
const ms = require(msPath)

const existingIds = new Set(ms.map(q => q.id))
const START_ID = 10100

const COGNITIVE_BY_DIFFICULTY = { Easy: 'recall', Medium: 'application', Hard: 'analysis' }
const TIME_BY_DIFFICULTY = { Easy: 60, Medium: 90, Hard: 120 }

// Manual corrections found during audit, applied on top of the parsed/
// generated content. Keyed by the original expansion-pack question number.
const FORCE_OVERRIDES = {
  // Original explanation referenced "A/B/C is incorrect" but the app never
  // displays letter labels next to choices, making the reasoning unreadable.
  1: {
    explanation: 'A waterfall chart is designed to show how sequential positive and negative values contribute to a final total. A clustered column chart is incorrect because it compares values but does not illustrate cumulative increases and decreases. A line chart is incorrect because it emphasizes trends over time rather than cumulative contributions. A scatter chart is incorrect because it analyzes relationships between two numeric measures.',
  },
  // COUNTROWS(VALUES(Customer[CustomerID])) only reflects Sales-side filters
  // if the relationship cross-filters both ways; the original wording didn't
  // specify that, so the "correct" answer wasn't rigorously guaranteed.
  99: {
    question: 'A semantic model contains Customer and Sales tables with an active relationship configured to filter in both directions (bidirectional cross-filtering).\n\nA measure needs to count the number of customers that placed at least one order after report filters are applied.\n\nWhich DAX pattern is most appropriate?',
    explanation: 'Because the relationship cross-filters in both directions, filters applied to the Sales table also filter the Customer table down to only the customers present in the filtered Sales rows. COUNTROWS(VALUES(Customer[CustomerID])) then counts exactly those customers. SUM and RELATED do not return counts, and DISTINCTCOUNT(Sales[SalesAmount]) counts distinct sales amounts rather than customers.',
  },
}

const built = parsed.map((p, idx) => {
  const newId = START_ID + idx
  if (existingIds.has(newId)) throw new Error('ID collision: ' + newId)

  const meta = metadata[String(p.id)]
  if (!meta) throw new Error('Missing metadata for expansion question ' + p.id)

  const override = FORCE_OVERRIDES[p.id] ?? {}
  const explanation = override.explanation || p.explanation || explanations[String(p.id)]
  if (!explanation) throw new Error('Missing explanation for expansion question ' + p.id)

  return {
    id: newId,
    type: 'single',
    domain: meta.domain,
    subtopic: meta.subtopic,
    difficulty: meta.difficulty,
    questionStyle: 'scenario',
    cognitiveLevel: COGNITIVE_BY_DIFFICULTY[meta.difficulty],
    question: override.question ?? p.question,
    choices: p.choices,
    correctAnswers: p.correctAnswers,
    explanation,
    estimatedTimeSeconds: TIME_BY_DIFFICULTY[meta.difficulty],
    tags: meta.tags,
    source: 'Microsoft Practice Assessment Expansion',
    officialStyle: true,
    isOfficialMicrosoft: false,
    originFile: 'PL300_Microsoft_Expansion_Pack.txt',
    questionGroupId: `ms_exp_unique_${newId}`,
    variantId: `ms_exp_${p.id}`,
  }
})

// Validate
for (const q of built) {
  if (q.choices.length < 3) throw new Error('Q' + q.id + ' has too few choices')
  if (q.correctAnswers.some(i => i < 0 || i >= q.choices.length)) throw new Error('Q' + q.id + ' correctAnswers out of range')
}

const merged = [...ms, ...built]
fs.writeFileSync(msPath, JSON.stringify(merged, null, 2), 'utf8')

console.log('Added', built.length, 'questions. New total:', merged.length)
console.log('ID range added:', built[0].id, '-', built[built.length - 1].id)
