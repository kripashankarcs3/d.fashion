const { chromium } = require('playwright');

const ids = ['37973750','37998083','40628224','38308203','37974486'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-IN',
  });
  const page = await ctx.newPage();

  // Capture XHR/fetch responses that contain product recommendations
  const recos = new Map();
  const seen = new Set();
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (!/recommend|similar|reco|bestseller|pdp.*related/i.test(url)) return;
      if (res.status() !== 200) return;
      const ct = res.headers()['content-type'] || '';
      if (!/json/.test(ct)) return;
      const body = await res.text();
      // extract all 8-digit product ids
      const m = body.match(/\d{8}/g);
      if (m && m.length) {
        for (const pid of m) seen.add(pid);
      }
    } catch (e) {}
  });

  const results = {};
  for (const id of ids) {
    seen.clear();
    const url = `https://www.myntra.com/dresses/nautiful/test/${id}/buy`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(9000);
      // scroll to trigger lazy recommendation loads
      for (let i = 0; i < 8; i++) {
        await page.mouse.wheel(0, 1200);
        await page.waitForTimeout(1200);
      }
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log(id, 'goto err', e.message);
    }
    results[id] = [...seen].filter(p => p !== id);
    console.log(id, 'recos:', JSON.stringify(results[id]));
  }
  require('fs').writeFileSync('reco-ids.json', JSON.stringify(results, null, 2));
  await browser.close();
})();
