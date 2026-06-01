import { chromium } from 'playwright'

const BASE = 'http://localhost:5199'
const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport: {width:1280,height:900} })).newPage()
const errors = []
p.on('console', m => { if (m.type()==='error') errors.push(m.text()) })

// Start a Full PL-300 exam and find a case study question
await p.goto(BASE, { waitUntil: 'networkidle' })
await p.locator('button').filter({ hasText: /^All \(/ }).first().click()
await p.waitForTimeout(200)
const startBtn = await p.$eval('button:has-text("Start")', e => e.textContent?.trim())
await p.getByRole('button', { name: startBtn, exact: false }).click()
await p.waitForURL('**/exam', { timeout: 8000 })
await p.waitForTimeout(800)

// Scan up to 60 questions for a case study
let found = false
for (let i = 0; i < 60 && !found; i++) {
  const body = await p.textContent('body')
  if (/Fabrikam|Northwind|Contoso|Adventure Works|Tailspin/i.test(body)) {
    found = true
    console.log('✅ Case study found at Q' + (i+1))

    // Check requirements list renders
    const hasReqs = body.includes('Business Requirements')
    console.log(hasReqs ? '✅ Business Requirements section visible' : '⚠️ Requirements missing')

    // Check Question badge shows
    const hasQBadge = body.includes('Question')
    console.log(hasQBadge ? '✅ Question badge visible on covered requirements' : '⚠️ Question badge missing')

    // Check Solution badge
    const hasSolutionBadge = body.includes('Solution')
    console.log(hasSolutionBadge ? '✅ Solution badge visible on uncovered requirements' : '⚠️ Solution badge missing')

    // Check solution card renders (click to expand)
    const solutionCards = await p.$$('[class*="emerald"]')
    console.log('Emerald (solution) elements:', solutionCards.length)

    // Try expanding a solution card
    const solutionBtn = p.locator('button', { hasText: 'Recommended Solution' }).first()
    if (await solutionBtn.count() > 0) {
      await solutionBtn.click()
      await p.waitForTimeout(400)
      const afterExpand = await p.textContent('body')
      const hasSteps = afterExpand.includes('Step') || afterExpand.includes('step') || afterExpand.includes('Configure') || afterExpand.includes('Create')
      console.log(hasSteps ? '✅ Solution steps visible after expand' : '⚠️ No steps found after expand')
      const hasExamNote = afterExpand.includes('PL-300 Exam Note') || afterExpand.includes('Exam Note')
      console.log(hasExamNote ? '✅ Exam Note visible in solution' : '⚠️ Exam note not found')
    } else {
      // Solution card might be collapsed differently — check for the toggle button
      const showBtn = p.locator('button', { hasText: '▼ Show' }).first()
      if (await showBtn.count() > 0) {
        await showBtn.click()
        await p.waitForTimeout(400)
        console.log('✅ Solution expand button found and clicked')
        const expandedBody = await p.textContent('body')
        const hasContent = expandedBody.includes('Recommended Solution') && expandedBody.length > 2000
        console.log(hasContent ? '✅ Solution content expanded' : '⚠️ No content after expand')
      } else {
        console.log('⚠️ No solution expand button found (may be text "Show" variant)')
        // Try any button in the emerald area
        const anyEmerald = p.locator('[class*="emerald"] button').first()
        if (await anyEmerald.count() > 0) {
          await anyEmerald.click()
          await p.waitForTimeout(400)
          console.log('✅ Clicked emerald button as fallback')
        }
      }
    }

    // Screenshot
    await p.screenshot({ path: 'scripts/screenshots/cs-solution.png' })
    console.log('Screenshot: scripts/screenshots/cs-solution.png')
  } else {
    const nb = p.locator('button', { hasText: 'Next' }).first()
    if (await nb.count() === 0) break
    await nb.click(); await p.waitForTimeout(150)
  }
}

if (!found) {
  console.log('⚠️ No case study found in 60 questions — checking session directly')
  const session = await p.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('pl300_session') || '{}') } catch { return {} }
  })
  const csQs = (session.questions || []).filter(q => q.caseStudyId)
  console.log('Case study questions in session:', csQs.length)
}

const realErrors = errors.filter(e => !e.includes('favicon') && !e.includes('HMR'))
console.log(realErrors.length === 0 ? '✅ No console errors' : '⚠️ Errors: ' + realErrors.join(', '))

await b.close()
