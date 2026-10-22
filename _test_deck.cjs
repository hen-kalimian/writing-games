const fs = require('fs');
const { chromium } = require('C:/Users/USER/.config/agents-hub/post-sync-agent/node_modules/playwright-core');
const exe = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => fs.existsSync(p));

(async () => {
  const browser = await chromium.launch({ executablePath: exe });
  const url = 'http://localhost:8766/play/index.html?g=9b09324f145c455da4dda2fc641ff6ad&t=8&th=58&m=deck&k=1&v=44';
  const errors = [];

  for (const vp of [{ name: 'desktop', width: 1280, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    page.on('pageerror', e => errors.push(vp.name + ': ' + e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(vp.name + ' console: ' + msg.text()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    // click the deck a few times to flip cards
    for (let i = 0; i < 3; i++) {
      await page.click('.deck');
      await page.waitForTimeout(400);
    }
    const fs = await page.evaluate(() => {
      const deck = document.querySelector('.deck');
      const t = document.querySelector('.deck .card .t');
      return {
        deckHTML: deck ? deck.outerHTML.slice(0, 400) : null,
        fontSize: t ? getComputedStyle(t).fontSize : null,
        inlineVar: t ? t.style.getPropertyValue('--fs') : null,
      };
    });
    await page.screenshot({ path: `C:/Users/USER/Documents/Claude/אוקטובר 2026/גיבוי לפני הגדלת אותיות בקלפים 8.10.26/deck-${vp.name}.png` });
    console.log(vp.name, JSON.stringify(fs));
    await page.close();
  }

  await browser.close();
  console.log('ERRORS:', JSON.stringify(errors));
})();
