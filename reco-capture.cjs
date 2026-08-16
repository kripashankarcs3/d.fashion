const { chromium } = require('playwright');
const fs = require('fs');

const ids = ['37973750','37998083','40628224','38308203','37974486'];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--disable-blink-features=AutomationControlled', '--disable-http2'],
  });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-IN',
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();

  const captured = {};
  page.on('response', async (res) => {
    try {
      const url = res.url();
      const m = url.match(/\/gateway\/v2\/product\/(\d+)\/related/);
      if (!m) return;
      if (res.status() !== 200) return;
      const body = await res.text();
      const id = m[1];
      captured[id] = body;
      fs.writeFileSync('related-' + id + '.json', body);
      console.log('captured', id, body.length);
    } catch (e) {}
  });

  for (const id of ids) {
    try {
      await page.goto(`https://www.myntra.com/dresses/nautiful/test/${id}/buy`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(10000);
      for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, 1400);
        await page.waitForTimeout(900);
      }
      await page.waitForTimeout(2000);
    } catch (e) { console.log(id, 'err', e.message.split('\n')[0]); }
  }
  await browser.close();
  console.log('done', Object.keys(captured));
})();
