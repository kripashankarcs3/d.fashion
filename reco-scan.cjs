const { chromium } = require('playwright');

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
    extraHTTPHeaders: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'accept-language': 'en-IN,en;q=0.9',
    },
  });
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await ctx.newPage();

  const seen = new Set();
  const apiLog = [];
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (/recommend|similar|reco|related|suggestion/i.test(url)) {
        apiLog.push(url + ' :: ' + res.status());
      }
      if (res.status() !== 200) return;
      const ct = res.headers()['content-type'] || '';
      if (!/json/.test(ct)) return;
      const body = await res.text();
      const m = body.match(/\d{8}/g);
      if (m && m.length) {
        for (const pid of m) seen.add(pid);
      }
    } catch (e) {}
  });

  const results = {};
  for (const id of ids) {
    seen.clear();
    apiLog.length = 0;
    const url = `https://www.myntra.com/dresses/nautiful/test/${id}/buy`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(12000);
      for (let i = 0; i < 10; i++) {
        await page.mouse.wheel(0, 1400);
        await page.waitForTimeout(1200);
      }
      await page.waitForTimeout(4000);
    } catch (e) {
      console.log(id, 'goto err', e.message.split('\n')[0]);
    }
    results[id] = { recos: [...seen].filter(p => p !== id), apis: [...apiLog] };
    console.log(id, 'recos:', JSON.stringify(results[id].recos));
    console.log(id, 'apis:', JSON.stringify(results[id].apis.slice(0, 10)));
  }
  require('fs').writeFileSync('reco-ids.json', JSON.stringify(results, null, 2));
  await browser.close();
})();
