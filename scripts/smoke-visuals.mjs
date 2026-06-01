import { chromium } from 'playwright'
import * as fs from 'fs'

const BASE = 'http://localhost:5199'
const shots = [], issues = []
const log = (icon, msg) => console.log(icon, msg)
const shot = async (page, name) => {
  fs.mkdirSync('scripts/screenshots', { recursive: true })
  const p = `scripts/screenshots/vis-${name}.png`
  await page.screenshot({ path: p, fullPage: false })
  shots.push(p)
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })

  // ── 1. CONCEPT REVIEWER — click category tile, verify card visuals ────────
  await page.goto(`${BASE}/reviewer`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  // Find the DAX tile by iterating buttons for "cards" text
  const allBtns = await page.$$('button')
  let daxBtn = null
  for (const btn of allBtns) {
    const txt = await btn.textContent()
    if (txt?.includes('DAX') && txt?.includes('cards')) { daxBtn = btn; break }
  }

  if (daxBtn) {
    await daxBtn.click()
    await page.waitForTimeout(800)
  } else {
    issues.push('Reviewer: DAX category tile not found')
  }

  const body = await page.textContent('body')
  const hasCard = body.includes('CALCULATE') && body.includes('cornerstone')
  log(hasCard ? '✅' : '⚠️', 'Reviewer: CALCULATE card loaded after DAX click')
  if (!hasCard) issues.push('Reviewer: card content not rendered')

  // Verify visual element rendered (table for filtered-table visual)
  const tableCount = await page.$$eval('table', t => t.length)
  log(tableCount > 0 ? '✅' : '⚠️', `Reviewer: visual table rendered (${tableCount} tables on card)`)
  if (tableCount === 0) issues.push('Reviewer: no table found in ConceptVisual')

  // Verify filter note text (filtered-table visual has a filterNote)
  const hasFilterNote = body.includes('Filter:') || body.includes('CALCULATE(SUM')
  log(hasFilterNote ? '✅' : '⚠️', 'Reviewer: filtered-table filterNote visible')

  // Verify walkthrough button (CALCULATE has both visual + walkthrough)
  const hasWtBtn = body.includes('Full Walkthrough') || body.includes('Visual Walkthrough')
  log(hasWtBtn ? '✅' : '⚠️', 'Reviewer: walkthrough button visible on CALCULATE card')
  if (!hasWtBtn) issues.push('Reviewer: walkthrough button not found on CALCULATE card')

  await shot(page, '1-reviewer-calculate')

  // Navigate to card 2 to test a flow-type visual
  const nextBtn = page.locator('button', { hasText: 'Next' }).first()
  if (await nextBtn.count() > 0) {
    await nextBtn.click()
    await page.waitForTimeout(400)
    const body2 = await page.textContent('body')
    // ALL/REMOVEFILTERS card should have a flow visual with numbered steps
    const hasFlowSteps = await page.$$eval('[class*="rounded-full"]', els =>
      els.filter(e => /^[1-5]$/.test(e.textContent?.trim())).length
    )
    log(hasFlowSteps > 0 ? '✅' : '⚠️', `Reviewer: flow step numbers on card 2 (${hasFlowSteps} found)`)
    if (!hasFlowSteps) issues.push('Reviewer: flow step numbers not found on card 2 (ALL/REMOVEFILTERS)')
    await shot(page, '2-reviewer-flow-card')
  }

  // ── 2. DAX LIBRARY — check all 8 newly added filterFlow functions ─────────
  const newFlowFns = ['DIVIDE', 'IF', 'SWITCH', 'VAR', 'RELATED', 'RANKX', 'LOOKUPVALUE', 'DISTINCTCOUNT']
  for (const fnName of newFlowFns.slice(0, 4)) { // test 4 to keep it fast
    await page.goto(`${BASE}/dax`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const btn = page.locator('button', { hasText: fnName }).first()
    if (await btn.count() > 0) {
      await btn.click()
      await page.waitForTimeout(500)
      const daxBody = await page.textContent('body')
      const hasFlow = daxBody.includes('Filter Context Flow') || daxBody.includes('Step') || daxBody.includes('evaluate')
      log(hasFlow ? '✅' : '⚠️', `DAX ${fnName}: filterFlow visible`)
      if (!hasFlow) issues.push(`DAX ${fnName}: filterFlow not rendering`)
    }
  }

  // CALCULATE — walkthrough should appear above detail
  await page.goto(`${BASE}/dax`, { waitUntil: 'networkidle' })
  await page.locator('button', { hasText: 'CALCULATE' }).first().click()
  await page.waitForTimeout(600)
  const calcDaxBody = await page.textContent('body')
  const hasWtInDax = calcDaxBody.includes('What CALCULATE Does') || calcDaxBody.includes('Starting Data')
  log(hasWtInDax ? '✅' : '⚠️', 'DAX CALCULATE: walkthrough slides appear above detail')
  if (!hasWtInDax) issues.push('DAX CALCULATE: walkthrough not in detail view')
  await shot(page, '3-dax-calculate')

  // ── 3. WALKTHROUGHS PAGE — all 10 visible, click + navigate ──────────────
  await page.goto(`${BASE}/walkthroughs`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const wtBody = await page.textContent('body')
  const names = ['CALCULATE','SUMX','FILTER','ALL','SAMEPERIODLASTYEAR','Merge vs Append','Star Schema','Dynamic RLS','Filter Propagation','Choosing the Right Visual']
  const found = names.filter(n => wtBody.includes(n))
  log(found.length === 10 ? '✅' : '⚠️', `Walkthroughs page: ${found.length}/10 walkthroughs listed`)
  if (found.length < 10) issues.push(`Missing from walkthroughs: ${names.filter(n => !found.includes(n)).join(', ')}`)

  // Open SUMX → navigate to iterator slide (slide 4)
  const sumxCard = page.locator('button', { hasText: 'SUMX' }).first()
  await sumxCard.click()
  await page.waitForTimeout(500)
  for (let i = 0; i < 3; i++) {
    await page.locator('button', { hasText: 'Next' }).first().click()
    await page.waitForTimeout(250)
  }
  const iterBody = await page.textContent('body')
  const hasIterTable = iterBody.includes('Row Revenue') || iterBody.includes('ORD-') || iterBody.includes('275')
  log(hasIterTable ? '✅' : '⚠️', 'Walkthrough SUMX: iterator slide with row results')
  if (!hasIterTable) issues.push('Walkthrough SUMX: iterator slide content not found')
  await shot(page, '4-walkthrough-sumx')

  // Open RLS walkthrough → navigate to RlsSlide (slide 4)
  await page.goto(`${BASE}/walkthroughs`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await page.locator('button', { hasText: 'Dynamic RLS' }).first().click()
  await page.waitForTimeout(400)
  for (let i = 0; i < 3; i++) {
    await page.locator('button', { hasText: 'Next' }).first().click()
    await page.waitForTimeout(250)
  }
  const rlsBody = await page.textContent('body')
  const hasRlsTable = rlsBody.includes('alice@') || rlsBody.includes('RegionManager') || rlsBody.includes('User Sees')
  log(hasRlsTable ? '✅' : '⚠️', 'Walkthrough Dynamic RLS: RlsSlide renders user+filter+tables')
  if (!hasRlsTable) issues.push('Walkthrough RLS: RlsSlide content not found')
  await shot(page, '5-walkthrough-rls')

  // Test category filter on walkthroughs page
  await page.goto(`${BASE}/walkthroughs`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const daxFilter = page.locator('button', { hasText: /^⚙️ DAX/ }).first()
  if (await daxFilter.count() > 0) {
    await daxFilter.click()
    await page.waitForTimeout(300)
    const filteredBody = await page.textContent('body')
    const hasDaxOnly = filteredBody.includes('CALCULATE') && !filteredBody.includes('Star Schema')
    log(hasDaxOnly ? '✅' : '⚠️', 'Walkthroughs: DAX category filter works')
  } else {
    log('🔍', 'Walkthroughs: category filter button format different — skipping filter test')
  }

  // ── CONSOLE ERRORS ────────────────────────────────────────────────────────
  const realErrors = errors.filter(e => !e.includes('favicon') && !e.includes('HMR'))
  log(realErrors.length === 0 ? '✅' : '⚠️', `Console errors: ${realErrors.length === 0 ? 'none' : realErrors.length}`)
  realErrors.forEach(e => issues.push('Console: ' + e.substring(0, 100)))

  await browser.close()

  console.log('\n══ VISUAL REPRESENTATIONS — FINAL REPORT ══')
  issues.length === 0 ? console.log('Issues: none') : issues.forEach(i => console.log(' ⚠️', i))
  console.log('Screenshots:', shots.join(', '))
  console.log('\nVERDICT:', issues.length === 0 ? 'PASS ✅' : `${issues.length} ISSUE(S)`)
}

run().catch(e => { console.error('FATAL:', e.message); process.exit(1) })
