import { chromium } from 'playwright';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';

const routes = [
  '/',
  '/upload',
  '/pricing',
  '/login',
  '/signup',
  '/chat',
  '/dashboard',
  '/try-on',
  '/report',
  '/this-page-does-not-exist',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const allErrors = [];

  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });

    try {
      const resp = await page.goto(TARGET_URL + route, {
        waitUntil: 'networkidle',
        timeout: 20000,
      });
      await page.waitForTimeout(800);
      const title = await page.title();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      results.push({ route, status: resp ? resp.status() : 'n/a', title, overflow, pageErrors, consoleErrors });
    } catch (err) {
      results.push({ route, status: 'ERR', error: err.message, pageErrors, consoleErrors });
    }
    allErrors.push(...pageErrors, ...consoleErrors);
    await page.close();
  }

  for (const r of results) {
    const issues = [];
    if (r.overflow) issues.push('H-OVERFLOW');
    if (r.pageErrors && r.pageErrors.length) issues.push(`PAGEERR: ${r.pageErrors.join(' | ')}`);
    if (r.consoleErrors && r.consoleErrors.length) issues.push(`CONSOLE: ${r.consoleErrors.slice(0, 2).join(' | ')}`);
    if (r.error) issues.push(r.error);
    console.log(`[${r.route}] status=${r.status} title="${r.title}" issues=${issues.length ? issues.join(' ; ') : 'none'}`);
  }

  const mob = await browser.newPage({ viewport: { width: 375, height: 667 } });
  for (const route of ['/', '/upload', '/pricing', '/dashboard']) {
    await mob.goto(TARGET_URL + route, { waitUntil: 'networkidle', timeout: 20000 });
    const overflow = await mob.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    console.log(`[MOBILE ${route}] overflow=${overflow}`);
  }
  await mob.close();

  const dedup = [...new Set(allErrors)];
  console.log('TOTAL ERRORS:', allErrors.length, 'UNIQUE:', dedup.length);
  dedup.forEach((e) => console.log('  >', e.slice(0, 300)));

  await browser.close();
})();
