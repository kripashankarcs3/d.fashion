import { chromium } from 'playwright';
import {
  GUEST_ONLY_PATHS,
  PUBLIC_PATHS,
  ROUTES,
  ROUTE_ALIASES,
} from '../src/config/navigation.ts';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';

/** Driven by the app's own navigation config so the test can never disagree.
 *  Public = marketing site (PUBLIC_PATHS) + auth screens (GUEST_ONLY_PATHS). */
const PUBLIC_ROUTES = [...PUBLIC_PATHS, ...GUEST_ONLY_PATHS];

/** Must bounce a signed-out visitor to /login. Every non-public route plus the
 *  legacy aliases (e.g. '/tryon' redirects via /try-on). */
const PROTECTED_ROUTES = [
  ...Object.values(ROUTES).filter(
    (path) => !PUBLIC_PATHS.has(path) && !GUEST_ONLY_PATHS.has(path),
  ),
  ...Object.keys(ROUTE_ALIASES),
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const allErrors = [];
  let failures = 0;

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
      const pathname = new URL(page.url()).pathname;
      results.push({
        route,
        status: resp ? resp.status() : 'n/a',
        title,
        redirectedToLogin: pathname === '/login' && route !== '/login',
        pageErrors,
        consoleErrors,
      });
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
    let hardFail = false;
    if (r.redirectedToLogin === false && PROTECTED_ROUTES.includes(r.route)) {
      issues.push('EXPECTED-LOGIN-REDIRECT');
      hardFail = true;
    }
    if (r.redirectedToLogin === true && PUBLIC_ROUTES.includes(r.route)) {
      issues.push('UNEXPECTED-LOGIN-REDIRECT');
      hardFail = true;
    }
    if (r.pageErrors && r.pageErrors.length) {
      issues.push(`PAGEERR: ${r.pageErrors.join(' | ')}`);
      hardFail = true;
    }
    if (r.consoleErrors && r.consoleErrors.length) {
      issues.push(`CONSOLE: ${r.consoleErrors.slice(0, 2).join(' | ')}`);
    }
    if (r.error) {
      issues.push(r.error);
      hardFail = true;
    }
    if (hardFail) failures += 1;
    const verdict = hardFail ? 'FAIL' : r.consoleErrors && r.consoleErrors.length ? 'WARN' : 'OK';
    console.log(`[${r.route}] status=${r.status} title="${r.title}" ${verdict} issues=${issues.length ? issues.join(' ; ') : 'none'}`);
  }

  const mob = await browser.newPage({ viewport: { width: 375, height: 667 } });
  for (const route of ['/home', '/upload', '/pricing', '/dashboard']) {
    await mob.goto(TARGET_URL + route, { waitUntil: 'networkidle', timeout: 20000 });
    await mob.waitForTimeout(800);
    const pathname = new URL(mob.url()).pathname;
    const overflow = await mob.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    const mobFail = overflow === true;
    if (mobFail) failures += 1;
    console.log(`[MOBILE ${route}] loginRedirect=${pathname === '/login'} overflow=${overflow} ${mobFail ? 'FAIL' : 'OK'}`);
  }
  await mob.close();

  // Anchor navigation — the headline feature of the refactor.
  // From /pricing, footer "How It Works" routes to /home and lands on the
  // section, tucked under the fixed header (regression-tests T1).
  const anchorPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await anchorPage.goto(TARGET_URL + '/pricing', { waitUntil: 'networkidle', timeout: 20000 });
    await anchorPage
      .locator('footer nav[aria-label="Product"] a', { hasText: 'How It Works' })
      .click();
    await anchorPage.waitForURL((url) => url.pathname === '/home', { timeout: 15000 });
    await anchorPage.waitForTimeout(1500);
    const top = await anchorPage.evaluate(() => {
      const el = document.getElementById('how-it-works');
      return el ? el.getBoundingClientRect().top : null;
    });
    const ok = top !== null && top >= 0 && top <= 100;
    if (!ok) failures += 1;
    console.log(`[ANCHOR /pricing->how-it-works] url=${anchorPage.url()} top=${top} ${ok ? 'OK' : 'FAIL'}`);
  } catch (err) {
    failures += 1;
    console.log('[ANCHOR /pricing->how-it-works] FAIL:', err.message);
  }
  await anchorPage.close();

  // From /home, header "Virtual Try-On" scrolls without a full page load — the
  // SPA state stamp must survive (a reload would wipe it).
  const spaPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await spaPage.goto(TARGET_URL + '/home', { waitUntil: 'networkidle', timeout: 20000 });
    await spaPage.evaluate(() => { window.__spa = true; });
    await spaPage
      .locator('header nav[aria-label="Primary"] a', { hasText: 'Virtual Try-On' })
      .click();
    await spaPage.waitForTimeout(2000);
    const result = await spaPage.evaluate(() => ({
      spa: window.__spa === true,
      top: document.getElementById('virtual-try-on')?.getBoundingClientRect().top ?? null,
    }));
    const ok = result.spa && result.top !== null && result.top >= 0 && result.top <= 100;
    if (!ok) failures += 1;
    console.log(`[ANCHOR /home->virtual-try-on] spaSurvived=${result.spa} top=${result.top} ${ok ? 'OK' : 'FAIL'}`);
  } catch (err) {
    failures += 1;
    console.log('[ANCHOR /home->virtual-try-on] FAIL:', err.message);
  }
  await spaPage.close();

  const dedup = [...new Set(allErrors)];
  console.log('TOTAL ERRORS:', allErrors.length, 'UNIQUE:', dedup.length);
  dedup.forEach((e) => console.log('  >', e.slice(0, 300)));

  // Console errors are warnings unless they exceed the threshold — dev-server
  // HMR noise and third-party scripts produce false positives. Page errors and
  // redirect-expectation mismatches above are hard failures.
  const CONSOLE_ERROR_LIMIT = 10;
  const consoleErrorsTotal = results.reduce(
    (n, r) => n + (r.consoleErrors?.length ?? 0),
    0,
  );
  if (consoleErrorsTotal > CONSOLE_ERROR_LIMIT) {
    console.log(
      `FAIL: ${consoleErrorsTotal} console errors exceed the limit of ${CONSOLE_ERROR_LIMIT}`,
    );
    failures += 1;
  }

  await browser.close();

  console.log(failures > 0 ? `FAILURES: ${failures}` : 'ALL CHECKS PASSED');
  process.exit(failures > 0 ? 1 : 0);
})();
