import { chromium } from 'playwright'

const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport: {width:390,height:844} })).newPage()
await p.goto('http://localhost:5199/reviewer', { waitUntil: 'networkidle' })
await p.waitForTimeout(500)

// Find the DAX category button specifically
const allBtns = await p.$$('button')
let daxBtn = null
for (const btn of allBtns) {
  const txt = await btn.textContent()
  if (txt?.includes('DAX') && txt?.includes('cards')) { daxBtn = btn; break }
}

if (!daxBtn) { console.log('DAX tile not found'); await b.close(); process.exit(1) }

await daxBtn.click()
await p.waitForTimeout(800)

const body = await p.textContent('body')
console.log('BODY AFTER CLICK:', body.substring(0, 600))

const tables = await p.$$('table')
console.log('Tables found:', tables.length)

const codeBlocks = await p.$$('.bg-gray-900')
console.log('Code blocks (bg-gray-900):', codeBlocks.length)

// Check first concept card's concept name
const h2 = await p.$('h2')
console.log('h2 text:', await h2?.textContent())

// Check if ConceptVisual rendered
const borderDivs = await p.$$eval('div', divs =>
  divs.filter(d => d.className?.includes('rounded-lg') && d.className?.includes('border')).map(d => d.className?.substring(0,80)).slice(0,8)
)
console.log('Bordered divs:', borderDivs.join('\n'))

await b.close()
