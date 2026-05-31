import { chromium } from 'playwright'

const b = await chromium.launch({ headless: true })
const p = await b.newPage()
await p.goto('http://localhost:5199', { waitUntil: 'networkidle' })
await p.waitForTimeout(500)
const btns = await p.$$eval('button', els => els.map(e => e.textContent?.trim().substring(0,80)).filter(Boolean))
console.log('HOME BUTTONS:\n' + btns.map((t,i) => `${i}: "${t}"`).join('\n'))
await b.close()
