import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const b = await chromium.launch({ headless: true })
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } })
const p = await ctx.newPage()
const errors = []
p.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })

// Inject a session with Q26 and land on home so ExamContext can pick it up
// then click "Resume →" to enter exam
const q26 = JSON.parse(readFileSync(join(__dirname, '../src/data/questions.json'), 'utf8'))
              .find(q => q.id === 26)

await p.goto('http://localhost:5199', { waitUntil: 'networkidle' })

await p.evaluate((question) => {
  localStorage.setItem('pl300_session', JSON.stringify({
    questions: [question],
    answers: {},
    flagged: {},
    confidence: {},
    questionTimes: {},
    currentIndex: 0,
    examStartTime: Date.now(),
    mode: 'exam',
    trackId: 'full_pl300',
    examSeed: 12345,
    answerChanges: {}
  }))
}, q26)

// Reload home so ExamContext reads the session from localStorage
await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(500)

// Click "Resume →"
const resumeBtn = p.locator('button', { hasText: /Resume/ }).first()
const hasResume = await resumeBtn.count() > 0
console.log('Setup  - "Resume →" button visible on home:', hasResume ? 'YES ✅' : 'NO ❌')

if (!hasResume) {
  await p.screenshot({ path: 'scripts/verify-home.png' })
  console.log('Home screenshot saved to scripts/verify-home.png')
  await b.close()
  process.exit(1)
}

await resumeBtn.click()
await p.waitForURL('**/exam', { timeout: 6000 })
await p.waitForTimeout(700)
await p.screenshot({ path: 'scripts/verify-pre.png' })

// ── STEP 1: Badge ──────────────────────────────────────────────────────────
const badge = p.locator('text=Select all that apply').first()
const hasBadge = await badge.count() > 0
console.log('STEP 1 - "Select all that apply" badge visible:', hasBadge ? 'YES ✅' : 'NO ❌')

// ── STEP 2: Choice buttons found ──────────────────────────────────────────
// choices are lettered A/B/C/D — locate by partial text
const choiceButtons = await p.locator('button').all()
const allText = await Promise.all(choiceButtons.map(b => b.textContent()))
const choiceAIdx = allText.findIndex(t => t?.includes('A sensitivity label applied'))
const choiceCIdx = allText.findIndex(t => t?.includes('When a labeled Power BI report'))
console.log('STEP 2 - Choice A found:', choiceAIdx >= 0 ? 'YES ✅' : 'NO ❌')
console.log('STEP 2 - Choice C found:', choiceCIdx >= 0 ? 'YES ✅' : 'NO ❌')

if (choiceAIdx < 0) {
  const bodySnippet = (await p.textContent('body')).substring(0, 400)
  console.log('Body snippet:', bodySnippet)
  await b.close()
  process.exit(1)
}

const choiceA = choiceButtons[choiceAIdx]
const choiceC = choiceButtons[choiceCIdx]

// ── STEP 3: Click A, verify C is not disabled ─────────────────────────────
await choiceA.click()
await p.waitForTimeout(300)
await p.screenshot({ path: 'scripts/verify-after-a.png' })

const isDisabled = await choiceC.evaluate(el => el.disabled)
console.log('STEP 3 - Choice C still enabled after selecting A:', !isDisabled ? 'YES ✅' : 'NO ❌')

// ── STEP 4: Click C — both should now be selected ─────────────────────────
await choiceC.click()
await p.waitForTimeout(400)
await p.screenshot({ path: 'scripts/verify-after-ac.png' })

// Read current answer state from localStorage to confirm both indices are stored
const storedAnswers = await p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('pl300_session') || '{}')
  return s.answers
})
const answer26 = storedAnswers?.[26]
console.log('STEP 4 - Answer stored for Q26:', JSON.stringify(answer26))
const bothSelected = Array.isArray(answer26) && answer26.includes(0) && answer26.includes(2)
console.log('STEP 4 - Both A(0) and C(2) selected:', bothSelected ? 'YES ✅' : `NO ❌ (got ${JSON.stringify(answer26)})`)

// ── PROBE: Clicking A a second time should deselect it ────────────────────
await choiceA.click()
await p.waitForTimeout(300)
const afterDeselect = await p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('pl300_session') || '{}')
  return s.answers?.[26]
})
const aDeselected = Array.isArray(afterDeselect) && !afterDeselect.includes(0) && afterDeselect.includes(2)
console.log('PROBE  - Clicking A again deselects it (toggle):', aDeselected ? 'YES ✅' : `NO ❌ (got ${JSON.stringify(afterDeselect)})`)

// ── PROBE: Single-choice still works ─────────────────────────────────────
console.log('\n--- PROBE: Single-choice question unchanged ---')
const q1 = JSON.parse(readFileSync(join(__dirname, '../src/data/questions.json'), 'utf8'))
            .find(q => q.id === 1)
await p.evaluate((question) => {
  localStorage.setItem('pl300_session', JSON.stringify({
    questions: [question],
    answers: {},
    flagged: {},
    confidence: {},
    questionTimes: {},
    currentIndex: 0,
    examStartTime: Date.now(),
    mode: 'exam',
    trackId: 'full_pl300',
    examSeed: 99999,
    answerChanges: {}
  }))
}, q1)
await p.goto('http://localhost:5199', { waitUntil: 'networkidle' })
await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(300)
const resumeBtn2 = p.locator('button', { hasText: /Resume/ }).first()
await resumeBtn2.click()
await p.waitForURL('**/exam', { timeout: 6000 })
await p.waitForTimeout(600)

const noBadge = await p.locator('text=Select all that apply').count() === 0
console.log('PROBE  - Single-choice has no "Select all that apply" badge:', noBadge ? 'YES ✅' : 'NO ❌')

// Click two different choices — second should replace first (radio)
const scButtons = await p.locator('button').all()
const scTexts = await Promise.all(scButtons.map(b => b.textContent()))
const sc0 = scButtons[scTexts.findIndex(t => t?.includes(q1.choices[0]))]
const sc1 = scButtons[scTexts.findIndex(t => t?.includes(q1.choices[1]))]
if (sc0 && sc1) {
  await sc0.click(); await p.waitForTimeout(200)
  await sc1.click(); await p.waitForTimeout(200)
  const scAnswer = await p.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('pl300_session') || '{}')
    return s.answers?.[1]
  })
  const radioOk = !Array.isArray(scAnswer) || scAnswer.length === 1
  console.log('PROBE  - Single-choice stores one answer:', radioOk ? `YES ✅ (${JSON.stringify(scAnswer)})` : `NO ❌ (${JSON.stringify(scAnswer)})`)
}
await p.screenshot({ path: 'scripts/verify-single.png' })

const consoleErrors = errors.filter(e => !e.includes('favicon') && !e.includes('HMR'))
console.log('\nConsole errors:', consoleErrors.length === 0 ? 'none ✅' : consoleErrors.join('\n  '))
await b.close()
