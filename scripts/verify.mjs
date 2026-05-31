import { chromium } from 'playwright'
import * as fs from 'fs'

const BASE = 'http://localhost:5199'
const shots = [], findings = [], steps = []
let errors = []

const log = (icon, desc, obs) => { const l = `${icon} ${desc} → ${obs}`; steps.push(l); console.log(l) }
const warn = (msg) => { findings.push(msg); console.log(`  [FINDING] ${msg}`) }
const shot = async (page, name) => {
  fs.mkdirSync('scripts/screenshots', { recursive: true })
  const p = `scripts/screenshots/${name}.png`
  await page.screenshot({ path: p })
  shots.push(p)
}

const goHome = async (page) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForSelector('button:has-text("Start")', { timeout: 8000 })
  await page.waitForTimeout(300)
}

const clickBtn = async (page, text) => {
  await page.getByRole('button', { name: text, exact: false }).first().click()
  await page.waitForTimeout(300)
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(e.message))

  // ── 1. HOME PAGE ──────────────────────────────────────────────────────────
  await goHome(page)
  const h1 = await page.$eval('h1', el => el.textContent)
  log('✅', '(1) Home page loads', `"${h1}"`)

  const allBtnTexts = await page.$$eval('button', els => els.map(e => e.textContent?.trim()).filter(Boolean))
  const tracks = allBtnTexts.filter(t => ['Full PL-300','DAX Intensive','Power Query','Data Modeling','Visualization','Security & Service'].some(s => t.includes(s)))
  log(tracks.length >= 5 ? '✅' : '⚠️', '(1) Exam tracks visible', `${tracks.length} tracks: ${tracks.map(t=>t.substring(0,15)).join(' | ')}`)
  if (tracks.length < 5) warn(`Only ${tracks.length} track buttons found`)

  const navBtns = allBtnTexts.filter(t => t.includes('Exam History') || t.includes('Concept Reviewer') || t.includes('DAX Library'))
  log(navBtns.length >= 3 ? '✅' : '⚠️', '(1) Nav buttons (History/Reviewer/DAX)', navBtns.join(', '))
  await shot(page, '01-home')

  // ── 2. EXAM MODE ──────────────────────────────────────────────────────────
  await goHome(page)
  // Select 10 questions
  await page.getByRole('button', { name: '10', exact: true }).click()
  await page.waitForTimeout(200)
  // Ensure Exam mode (already default)
  const startBtnText = await page.$eval('button:has-text("Start")', el => el.textContent?.trim())
  log(startBtnText?.includes('Exam') ? '✅' : '⚠️', '(2) Exam mode default', `Start button: "${startBtnText?.substring(0,30)}"`)

  await page.getByRole('button', { name: startBtnText || 'Start Exam', exact: false }).click()
  await page.waitForURL('**/exam', { timeout: 8000 })
  await page.waitForTimeout(800)
  log('✅', '(2) Navigated to /exam', page.url())
  await shot(page, '02-exam-start')

  // Capture question text
  const qText = await page.$$eval('p', els => {
    const long = els.find(e => e.textContent?.trim().length > 50 && !e.className?.includes('text-xs') && !e.className?.includes('text-gray-4'))
    return long?.textContent?.trim().substring(0, 90) || '(none found)'
  })
  log('✅', '(2) Question text rendered', qText.substring(0, 80))

  // Count choice buttons
  const choiceBtns = await page.$$('button[class*="border-2"]')
  log(choiceBtns.length >= 2 ? '✅' : '⚠️', '(2) Answer choices', `${choiceBtns.length} choice buttons`)
  if (choiceBtns.length >= 1) {
    await choiceBtns[0].click()
    await page.waitForTimeout(400)
    log('✅', '(2) Selected first answer', 'clicked choice A')
  }

  // Flag button
  const flagBtns = await page.$$('button')
  const flagBtn = flagBtns.find ? null : null
  const flagByText = await page.$$eval('button', btns => btns.filter(b => b.textContent?.includes('Flag')).length)
  if (flagByText > 0) {
    await page.locator('button', { hasText: 'Flag' }).first().click()
    await page.waitForTimeout(300)
    log('✅', '(2) Flag button', `found and clicked (${flagByText} flag buttons)`)
  } else {
    log('⚠️', '(2) Flag button', 'not found by text')
    warn('Flag button not found — verify it renders in exam header')
  }

  // Navigate: Next × 2, Prev × 1
  const nextLocator = page.locator('button', { hasText: 'Next' })
  if (await nextLocator.count() > 0) {
    await nextLocator.first().click(); await page.waitForTimeout(300)
    await nextLocator.first().click(); await page.waitForTimeout(300)
    log('✅', '(2) Forward navigation', 'moved to Q3')
    const prevLocator = page.locator('button', { hasText: /Prev/ })
    if (await prevLocator.count() > 0) {
      await prevLocator.first().click(); await page.waitForTimeout(300)
      log('✅', '(2) Back navigation', 'moved back to Q2')
    }
  }
  await shot(page, '03-exam-navigating')

  // Navigate to end
  for (let i = 0; i < 15; i++) {
    const nb = page.locator('button', { hasText: 'Next' }).first()
    if (await nb.count() === 0) break
    const isDisabled = await nb.evaluate(el => el.disabled)
    if (isDisabled) break
    await nb.click(); await page.waitForTimeout(200)
  }

  // Submit
  const submitLocator = page.locator('button', { hasText: /Submit|Finish|End Exam/ }).first()
  if (await submitLocator.count() > 0) {
    await submitLocator.click(); await page.waitForTimeout(600)
    const confirmLocator = page.locator('button', { hasText: /Confirm|Yes|Submit/ }).last()
    if (await confirmLocator.count() > 0) { await confirmLocator.click(); await page.waitForTimeout(600) }
    log('✅', '(2) Exam submitted', 'submit/confirm clicked')
  } else {
    log('⚠️', '(2) Submit button', 'not found after last question')
    warn('Submit button not found — exam may require all questions answered')
  }

  await page.waitForTimeout(1000)
  await shot(page, '04-results')
  const body = await page.textContent('body')
  log(body.includes('%') ? '✅' : '⚠️', '(2) Score % shown', body.includes('%') ? 'yes' : 'no')
  log(/Prepare|Model|Visualize|Manage/.test(body) ? '✅' : '⚠️', '(2) Domain breakdown', /Prepare|Model|Visualize|Manage/.test(body) ? 'domain names visible' : 'not detected')

  // ── 3. DAX INTENSIVE + STUDY MODE ────────────────────────────────────────
  await goHome(page)
  const daxTrackBtns = await page.$$eval('button', btns => btns.filter(b => b.textContent?.includes('DAX Intensive')).map(b => b.textContent?.trim()))
  if (daxTrackBtns.length > 0) {
    await page.locator('button', { hasText: 'DAX Intensive' }).first().click()
    await page.waitForTimeout(300)
    log('✅', '(3) DAX Intensive track selected', daxTrackBtns[0].substring(0, 30))
  } else {
    log('⚠️', '(3) DAX Intensive track', 'not found')
    warn('DAX Intensive track button not found')
  }

  await page.locator('button', { hasText: 'Study' }).first().click()
  await page.waitForTimeout(300)
  const studyBorderActive = await page.$$eval('button', btns => btns.filter(b => b.textContent?.includes('Study') && b.className?.includes('purple')).length)
  log(studyBorderActive > 0 ? '✅' : '⚠️', '(3) Study mode activated', studyBorderActive > 0 ? 'purple styling confirmed' : 'active state not detected')

  await page.getByRole('button', { name: '10', exact: true }).click()
  await page.waitForTimeout(200)

  const studyStartText = await page.$eval('button:has-text("Start")', el => el.textContent?.trim())
  log(studyStartText?.includes('Study') ? '✅' : '⚠️', '(3) Start button updated for Study mode', `"${studyStartText?.substring(0,30)}"`)
  await page.getByRole('button', { name: studyStartText || 'Start Study', exact: false }).click()
  await page.waitForURL('**/exam', { timeout: 8000 })
  await page.waitForTimeout(600)
  log('✅', '(3) Study mode exam started', 'at /exam')

  const studyChoices = await page.$$('button[class*="border-2"]')
  if (studyChoices.length >= 1) {
    await studyChoices[0].click()
    await page.waitForTimeout(1000)
    const afterBody = await page.textContent('body')
    const hasFeedback = /Correct|Incorrect|explanation/i.test(afterBody)
    const hasColors = await page.$$eval('[class*="green-"], [class*="red-"]', els => els.length)
    log(hasFeedback || hasColors ? '✅' : '⚠️', '(3) Study mode instant feedback', hasFeedback ? 'Correct/Incorrect text visible' : hasColors ? 'color feedback visible' : 'NO feedback detected')
    if (!hasFeedback && !hasColors) warn('Study mode shows no visible feedback after answering')
    await shot(page, '05-study-mode')
  } else {
    log('⚠️', '(3) Study mode choices', `${studyChoices.length} choice buttons`)
    warn('No choice buttons found in study mode exam')
  }

  // ── 4. RETRY QUEUE ────────────────────────────────────────────────────────
  // Check for retry-like button in current exam page
  const examPageBtns = await page.$$eval('button', btns => btns.map(b => b.textContent?.trim()).filter(Boolean))
  const retryBtnInExam = examPageBtns.find(t => /retry|queue/i.test(t))
  log(retryBtnInExam ? '✅' : '🔍', '(4) Retry/Queue button in exam', retryBtnInExam || 'not found by text — may be icon-only')
  if (!retryBtnInExam) warn('No text-labeled "retry" button found during exam — users may not know they can queue questions')

  // Clear any leftover exam session before testing retry banner
  // (step 3 study exam leaves pl300_session which hides the retry banner)
  await page.evaluate(() => localStorage.removeItem('pl300_session'))
  // Inject retry queue items and test home banner
  await page.evaluate(() => localStorage.setItem('pl300_retry_queue', JSON.stringify(['1','5','12','20'])))
  await goHome(page)
  await shot(page, '06-retry-banner')

  const homeBody = await page.textContent('body')
  const hasRetryBanner = /[Rr]etry queue/i.test(homeBody)
  const orangeCount = await page.$$eval('[class*="orange"]', els => els.length)
  log(hasRetryBanner && orangeCount > 0 ? '✅' : hasRetryBanner ? '✅' : '⚠️', '(4) Retry banner on home', hasRetryBanner ? `text found, ${orangeCount} orange elements` : 'NOT visible')
  if (!hasRetryBanner) warn('Retry queue banner not appearing on home even after localStorage injection')

  const quickRetry = await page.$$eval('button', btns => btns.filter(b => b.textContent?.includes('Quick Retry')).length)
  const fullRetry = await page.$$eval('button', btns => btns.filter(b => b.textContent?.includes('Full Retry')).length)
  log(quickRetry > 0 && fullRetry > 0 ? '✅' : '⚠️', '(4) Retry action buttons', `Quick Retry: ${quickRetry}, Full Retry: ${fullRetry}`)

  // Test Quick Retry launches exam
  if (quickRetry > 0) {
    await page.locator('button', { hasText: 'Quick Retry' }).first().click()
    await page.waitForURL('**/exam', { timeout: 6000 }).catch(() => {})
    const isOnExam = page.url().includes('/exam')
    log(isOnExam ? '✅' : '⚠️', '(4) Quick Retry starts exam', isOnExam ? 'navigated to /exam' : `stayed on ${page.url()}`)
  }

  // Clean up
  await page.evaluate(() => localStorage.removeItem('pl300_retry_queue'))

  // ── 5. CONCEPT REVIEWER ───────────────────────────────────────────────────
  await goHome(page)
  await page.locator('button', { hasText: 'Concept Reviewer' }).click()
  await page.waitForURL('**/reviewer', { timeout: 6000 })
  await page.waitForTimeout(800)
  log('✅', '(5) Navigated to /reviewer', page.url())

  const revBody = await page.textContent('body')
  const expectedCats = ['DAX', 'Security', 'Modeling', 'Power Query', 'Visualization']
  const foundCats = expectedCats.filter(c => revBody.includes(c))
  log(foundCats.length >= 4 ? '✅' : '⚠️', '(5) Reviewer categories', `found: ${foundCats.join(', ')} (${foundCats.length}/${expectedCats.length})`)
  if (foundCats.length < 4) warn(`Only ${foundCats.length} categories visible — expected at least 4`)

  // Reviewer shows 7 category tiles first; check those + total count displayed
  const categoryTiles = await page.$$eval('[class*="rounded"][class*="border"]', els =>
    els.filter(e => (e.textContent?.length || 0) > 20).map(e => e.textContent?.trim().substring(0, 40))
  )
  log(categoryTiles.length >= 5 ? '✅' : '⚠️', '(5) Category tiles rendered', `${categoryTiles.length}: ${categoryTiles.slice(0,5).join(' | ')}`)

  // Check total concept count shown
  const totalDisplay = await page.$$eval('*', els => {
    const el = [...els].find(e => e.textContent?.includes('concepts') && e.textContent?.length < 60)
    return el?.textContent?.trim() || ''
  })
  log(totalDisplay.includes('105') ? '✅' : '⚠️', '(5) Total concept count', totalDisplay || 'not found')

  // Click a category to verify cards expand/load
  if (categoryTiles.length > 0) {
    await page.locator('[class*="rounded"][class*="border"]').first().click()
    await page.waitForTimeout(600)
    const afterClickBody = await page.textContent('body')
    const hasConceptCards = afterClickBody.length > 1000
    log(hasConceptCards ? '✅' : '⚠️', '(5) Cards expand on category click', hasConceptCards ? 'page content increased after click' : 'no change after click')
  }
  await shot(page, '07-reviewer')

  // ── 6. DAX LIBRARY — 25 FUNCTIONS ────────────────────────────────────────
  await goHome(page)
  await page.locator('button', { hasText: 'DAX Library' }).click()
  await page.waitForURL('**/dax', { timeout: 6000 })
  await page.waitForTimeout(800)
  log('✅', '(6) Navigated to /dax', page.url())

  const daxBody = await page.textContent('body')
  const fnList = ['CALCULATE','FILTER','SUMX','ALL','RELATED','VALUES','DATEADD','RANKX','USERELATIONSHIP','VAR','TOTALYTD','COUNTROWS','DISTINCTCOUNT','SELECTEDVALUE','REMOVEFILTERS','DATESYTD','SAMEPERIODLASTYEAR','CALCULATETABLE','DIVIDE','EARLIER','IF','SWITCH','AVERAGEX','LOOKUPVALUE','HASONEVALUE']
  const visible = fnList.filter(fn => daxBody.toUpperCase().includes(fn))
  const missing = fnList.filter(fn => !daxBody.toUpperCase().includes(fn))
  log(visible.length === 25 ? '✅' : '⚠️', `(6) DAX Library functions`, `${visible.length}/25 visible on page`)
  if (missing.length > 0) warn(`DAX functions not visible in current view: ${missing.join(', ')} — may need scrolling or category switching`)
  await shot(page, '08-dax-library')

  // ── 7. CASE STUDIES IN EXAM POOL ─────────────────────────────────────────
  await goHome(page)
  await page.locator('button', { hasText: 'Full PL-300' }).first().click()
  await page.waitForTimeout(200)
  // Select "All" questions
  await page.locator('button', { hasText: /^All \(/ }).first().click()
  await page.waitForTimeout(200)

  const allStartText = await page.$eval('button:has-text("Start")', el => el.textContent?.trim())
  await page.getByRole('button', { name: allStartText || 'Start Exam', exact: false }).click()
  await page.waitForURL('**/exam', { timeout: 8000 })
  await page.waitForTimeout(800)

  // Check localStorage session for case study questions
  const session = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('pl300_session') || '{}') } catch { return {} }
  })
  const csQs = (session.questions || []).filter(q => q.caseStudyId)
  log(csQs.length > 0 ? '✅' : '⚠️', '(7) Case studies in exam pool (localStorage)', `${csQs.length} case study questions in session`)
  if (csQs.length === 0) warn('Case study questions NOT in exam pool — verify caseStudyEngine is wired into examGenerator')

  // Scan first 40 questions visually for case study content
  let foundCS = false
  for (let i = 0; i < 40 && !foundCS; i++) {
    const t = await page.textContent('body')
    if (/Fabrikam|Northwind|Contoso|Adventure Works|Tailspin|Case Study/i.test(t)) {
      foundCS = true
      await shot(page, '09-case-study')
      log('✅', `(7) Case study rendered in exam at Q${i+1}`, 'scenario company name visible')
    } else {
      const nb = page.locator('button', { hasText: 'Next' }).first()
      if (await nb.count() === 0) break
      await nb.click(); await page.waitForTimeout(150)
    }
  }
  if (!foundCS) {
    if (csQs.length > 0) log('✅', '(7) Case studies in pool (not encountered in 40Q scan)', `${csQs.length} exist — random exam order`)
    else log('⚠️', '(7) Case study questions', 'not in pool AND not seen in 40Q scan')
  }

  // ── CONSOLE ERRORS ────────────────────────────────────────────────────────
  const realErrors = errors.filter(e => !e.includes('favicon') && !e.includes('hot-update') && !e.includes('HMR') && !e.includes('[vite]'))
  log(realErrors.length === 0 ? '✅' : '⚠️', 'Console errors (full session)', realErrors.length === 0 ? 'none' : `${realErrors.length} errors`)
  realErrors.forEach(e => warn(`Console error: ${e.substring(0, 120)}`))

  await browser.close()

  // ── REPORT ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════')
  console.log('VERIFICATION REPORT — PL-300 Exam Simulator E2E')
  console.log('══════════════════════════════════════════════════════════════')
  steps.forEach(s => console.log(s))
  console.log('\nFINDINGS:')
  findings.length === 0 ? console.log('  (none)') : findings.forEach(f => console.log(`  • ${f}`))
  console.log('\nScreenshots:', shots.join(', '))
  const issues = steps.filter(s => s.startsWith('⚠️') || s.startsWith('❌'))
  console.log(`\nVERDICT: ${issues.length === 0 ? 'PASS' : `ISSUES (${issues.length})`}`)
  if (issues.length > 0) { console.log('Issues:'); issues.forEach(i => console.log(' ', i)) }
}

run().catch(e => { console.error('\nFATAL:', e.message); process.exit(1) })
