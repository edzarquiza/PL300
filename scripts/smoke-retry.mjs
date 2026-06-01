import { chromium } from 'playwright'

const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport:{width:1280,height:900} })).newPage()
const errors = []
p.on('console', m => { if (m.type()==='error') errors.push(m.text()) })

// Start a 10-question exam
await p.goto('http://localhost:5199', { waitUntil: 'networkidle' })
await p.getByRole('button', { name: '10', exact: true }).click()
const startTxt = await p.$eval('button:has-text("Start")', e => e.textContent?.trim())
await p.getByRole('button', { name: startTxt, exact: false }).click()
await p.waitForURL('**/exam', { timeout: 8000 })
await p.waitForTimeout(600)

// Capture Q IDs from session
const session1 = await p.evaluate(() => JSON.parse(localStorage.getItem('pl300_session') || '{}'))
const ids1 = (session1.questions || []).map(q => String(q.id))
console.log('Exam 1 Q IDs:', ids1.join(','), '| total:', ids1.length)

// Answer all questions then submit
for (let i = 0; i < 15; i++) {
  // Answer if unanswered
  const choices = await p.$$('button[class*="border-2"]')
  if (choices.length >= 1) await choices[0].click().catch(() => {})
  await p.waitForTimeout(150)
  // Try next
  const nb = p.locator('button', { hasText: 'Next' }).first()
  if (await nb.count() === 0) break
  const disabled = await nb.evaluate(el => el.disabled)
  if (disabled) break
  await nb.click(); await p.waitForTimeout(200)
}

// Find and click submit / end exam button
let submitted = false
for (const text of ['Submit', 'End Exam', 'Finish', 'Submit Exam']) {
  const btn = p.locator('button', { hasText: text }).first()
  if (await btn.count() > 0) {
    await btn.click(); await p.waitForTimeout(500)
    submitted = true; break
  }
}
// Handle any confirmation dialog
await p.waitForTimeout(300)
for (const text of ['Submit', 'Confirm', 'Yes', 'End']) {
  const btn = p.locator('button', { hasText: text }).first()
  if (await btn.count() > 0 && p.url().includes('/exam')) {
    await btn.click(); await p.waitForTimeout(400); break
  }
}

// Wait for results page (with fallback check)
await p.waitForURL('**/results', { timeout: 10000 }).catch(async () => {
  console.log('URL after submit:', p.url())
  const body = await p.textContent('body')
  console.log('Body snippet:', body.substring(0, 200))
})
await p.waitForTimeout(600)

// Verify Retry Same button exists
const retryBtn = p.locator('button', { hasText: /Retry Same/ }).first()
const hasRetry = await retryBtn.count() > 0
console.log('Retry Same button visible:', hasRetry ? 'YES ✅' : 'NO ⚠️')

if (hasRetry) {
  await retryBtn.click()
  await p.waitForURL('**/exam', { timeout: 8000 })
  await p.waitForTimeout(600)

  const session2 = await p.evaluate(() => JSON.parse(localStorage.getItem('pl300_session') || '{}'))
  const ids2 = (session2.questions || []).map(q => String(q.id))
  console.log('Exam 2 Q IDs:', ids2.join(','), '| total:', ids2.length)

  const set1 = new Set(ids1), set2 = new Set(ids2)
  const sameSet = ids1.length === ids2.length && [...set1].every(id => set2.has(id))
  console.log('Same question set:', sameSet ? 'YES ✅' : 'NO ⚠️')
  if (!sameSet) {
    const missing = ids1.filter(id => !set2.has(id))
    const extra = ids2.filter(id => !set1.has(id))
    if (missing.length) console.log('  Missing from retry:', missing)
    if (extra.length) console.log('  Extra in retry:', extra)
  }

  // Verify exam renders (not stuck on results or home)
  const body = await p.textContent('body')
  const onExam = p.url().includes('/exam')
  console.log('Navigated back to exam:', onExam ? 'YES ✅' : 'NO ⚠️')
  console.log('First question visible:', body.length > 500 ? 'YES ✅' : 'NO ⚠️')
}

const realErrors = errors.filter(e => !e.includes('favicon') && !e.includes('HMR'))
console.log('Console errors:', realErrors.length === 0 ? 'none ✅' : realErrors.join(', '))

await b.close()
console.log('\nVERDICT:', (!hasRetry || errors.length) ? 'ISSUES' : 'PASS ✅')
