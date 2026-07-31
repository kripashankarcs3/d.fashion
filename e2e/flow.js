import { chromium } from 'playwright';

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';
const EMAIL = `e2e_${Date.now()}@test.local`;

const analysis = {
  enhancedImageUrl: '',
  skinConcerns: {
    acne: 0.1, darkSpots: 0.2, wrinkles: 0.1, pores: 0.1, oiliness: 0.2,
    dryness: 0.3, redness: 0.1, eyeBags: 0.1, darkCircles: 0.2, uneven: 0.1,
    sensitivity: 0.2, texture: 0.1, firmness: 0.8, radiance: 0.7,
  },
  colorProfile: {
    undertone: 'warm', skinToneHex: '#D9A06F', eyeColor: 'brown', lipColor: 'rose', hairColor: 'black',
  },
  recommendations: {
    outfitPalette: ['#A0522D'], avoidColors: [], makeupShades: { foundation: 'x', blush: 'y', lip: 'z' },
    hairColorOptions: [], skincareRoutine: [], styleInsight: 'x',
  },
  analyzedAt: new Date().toISOString(),
  colourSeason: 'Warm Autumn',
  bestNeutrals: ['Beige'],
  styleArchetypes: [{ title: 'Classic', description: 'd' }],
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  // 1. Signup with plan param + field validation
  await page.goto(TARGET_URL + '/signup?plan=Essentials', { waitUntil: 'networkidle' });
  const planNote = await page.textContent('body');
  console.log('PLAN-NOTE shown:', planNote.includes('choosing the') && planNote.includes('Essentials'));

  await page.click('button[type="submit"]');
  await page.waitForTimeout(400);
  const hasFieldErrors = await page.locator('[role="alert"]').count();
  console.log('FIELD-ERRORS shown:', hasFieldErrors >= 2);

  await page.fill('#name', 'E2E Tester');
  await page.fill('#email', EMAIL);
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  console.log('SIGNUP-REDIRECT: dashboard reached, title=', await page.title());

  // 2. Stylist chat (input is disabled without an analysis, so seed a report)
  await page.goto(TARGET_URL + '/chat', { waitUntil: 'networkidle' });
  await page.evaluate((a) => {
    localStorage.setItem('dfashion_analysis_result', JSON.stringify({
      state: { analysisResult: a, analysisHistory: [], savedReports: [], wardrobeItems: [], activityLog: [], referenceImageUrl: null },
      version: 0,
    }));
  }, analysis);
  await page.reload({ waitUntil: 'networkidle' });

  const input = page.locator('input[type="text"], textarea').first();
  await input.waitFor({ state: 'visible', timeout: 10000 });
  const enabled = await input.isEnabled();
  console.log('CHAT-INPUT enabled after seeding report:', enabled);

  await input.fill('What colours should I wear for a wedding?');
  await page.locator('button[type="submit"], button[aria-label*="Send"]').first().click();
  await page.waitForTimeout(4000);
  const chatText = await page.textContent('body');
  const hasReply = chatText.includes('wedding') || chatText.includes('Warm Autumn') || chatText.includes('palette') || chatText.includes('shade');
  console.log('CHAT-REPLY received:', hasReply);

  console.log('ERRORS:', errors.length, errors.slice(0, 5).join(' | '));
  await browser.close();
})();
