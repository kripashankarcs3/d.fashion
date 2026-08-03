import { chromium } from 'playwright';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';

const PUBLIC_ROUTES = ['/login', '/signup'];
const PROTECTED_ROUTES = [
  '/',
  '/upload',
  '/pricing',
  '/chat',
  '/dashboard',
  '/try-on',
  '/report',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const allErrors = [];

  for (const route of PUBLIC_ROUTES) {
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
      results.push({ route, status: resp ? resp.status() : 'n/a', title, pageErrors, consoleErrors });
    } catch (err) {
      results.push({ route, status: 'ERR', error: err.message, pageErrors, consoleErrors });
    }
    allErrors.push(...pageErrors, ...consoleErrors);
    await page.close();
  }

  for (const route of PROTECTED_ROUTES) {
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
      await page.waitForTimeout(1200);
      const title = await page.title();
      const pathname = new URL(page.url()).pathname;
      const redirectedToLogin = pathname === '/login';
      results.push({
        route,
        status: resp ? resp.status() : 'n/a',
        title,
        redirectedToLogin,
        pageErrors,
        consoleErrors,
      });
    } catch (err) {
      results.push({ route, status: 'ERR', error: err.message, pageErrors, consoleErrors });
    }
    allErrors.push(...pageErrors, ...consoleErrors);
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  try {
    const resp = await page.goto(TARGET_URL + '/this-page-does-not-exist', {
      waitUntil: 'networkidle',
      timeout: 20000,
    });
    await page.waitForTimeout(1200);
    const pathname = new URL(page.url()).pathname;
    results.push({
      route: '/this-page-does-not-exist',
      status: resp ? resp.status() : 'n/a',
      title: await page.title(),
      redirectedToLogin: pathname === '/login',
      pageErrors,
      consoleErrors: [],
    });
  } catch (err) {
    results.push({ route: '/this-page-does-not-exist', status: 'ERR', error: err.message, pageErrors, consoleErrors: [] });
  }
  allErrors.push(...pageErrors);
  await page.close();

  for (const r of results) {
    const issues = [];
    if (r.redirectedToLogin === false && PROTECTED_ROUTES.includes(r.route)) {
      issues.push('EXPECTED-LOGIN-REDIRECT');
    }
    if (r.redirectedToLogin === true && PUBLIC_ROUTES.includes(r.route)) {
      issues.push('UNEXPECTED-LOGIN-REDIRECT');
    }
    if (r.pageErrors && r.pageErrors.length) issues.push(`PAGEERR: ${r.pageErrors.join(' | ')}`);
    if (r.consoleErrors && r.consoleErrors.length) issues.push(`CONSOLE: ${r.consoleErrors.slice(0, 2).join(' | ')}`);
    if (r.error) issues.push(r.error);
    console.log(`[${r.route}] status=${r.status} title="${r.title}" issues=${issues.length ? issues.join(' ; ') : 'none'}`);
  }

  const mob = await browser.newPage({ viewport: { width: 375, height: 667 } });
  for (const route of ['/', '/upload', '/pricing', '/dashboard']) {
    await mob.goto(TARGET_URL + route, { waitUntil: 'networkidle', timeout: 20000 });
    await mob.waitForTimeout(800);
    const pathname = new URL(mob.url()).pathname;
    const overflow = await mob.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    console.log(`[MOBILE ${route}] loginRedirect=${pathname === '/login'} overflow=${overflow}`);
  }
  await mob.close();

  const dedup = [...new Set(allErrors)];
  console.log('TOTAL ERRORS:', allErrors.length, 'UNIQUE:', dedup.length);
  dedup.forEach((e) => console.log('  >', e.slice(0, 300)));

  await browser.close();
})();
