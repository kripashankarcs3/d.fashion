/**
 * Fetch ALL YouCam templates (all pages) and output as TypeScript arrays
 *   node fetch-all-youcam-templates.mjs > youcam-templates-output.ts
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Manually parse server/.env
const envPath = resolve(__dirname, 'server/.env');
const envContent = readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim().replace(/^"(.*)"$/, '$1');
  process.env[key] = val;
}

const YOUCAM_BASE = 'https://yce-api-01.perfectcorp.com';
const API_KEY = process.env.YOUCAM_API_KEY;

if (!API_KEY) {
  console.error('❌  YOUCAM_API_KEY not found in server/.env');
  process.exit(1);
}

const client = axios.create({
  baseURL: YOUCAM_BASE,
  headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
  timeout: 30000,
});

async function fetchAllPages(feature) {
  const allItems = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    try {
      const { data } = await client.get(`/s2s/v2.0/task/template/${feature}`, {
        params: { page, page_size: 50 },  // max allowed is 50
      });

      const raw = data?.data?.styles ?? data?.data?.templates ?? data?.data ?? [];
      const items = Array.isArray(raw) ? raw : Object.values(raw);

      if (items.length === 0) break;

      allItems.push(...items);

      totalPages = data.data?.total_pages ?? 1;
      console.error(`✅  ${feature} page ${page}/${totalPages} — ${items.length} items`);

      page++;
    } catch (err) {
      console.error(`❌  Failed at page ${page}:`, err.response?.data ?? err.message);
      break;
    }
  }

  return allItems;
}

async function run() {
  console.log('\n🔍  Fetching ALL YouCam templates (all pages)...\n');

  const [makeupItems, hairItems] = await Promise.all([
    fetchAllPages('look-vto'),
    fetchAllPages('hair-style'),
  ]);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Generate TypeScript arrays
  const makeupArray = makeupItems.map(t => {
    const id = t.id ?? t.template_id ?? t.look_id;
    const name = t.title ?? t.name ?? t.look_name ?? id;
    const thumb = t.thumb ?? t.thumbnail ?? t.preview_url ?? '';
    return `    { id: '${id}', title: '${escapeString(name)}', thumb: '${thumb}' }`;
  }).join(',\n');

  const hairArray = hairItems.map(t => {
    const id = t.id ?? t.template_id ?? t.style_id;
    const name = t.title ?? t.name ?? t.style_name ?? id;
    const thumb = t.thumb ?? t.thumbnail ?? t.preview_url ?? '';
    return `    { id: '${id}', title: '${escapeString(name)}', thumb: '${thumb}' }`;
  }).join(',\n');

  console.log('// YouCam Makeup Templates (look-vto)');
  console.log(`const makeupTemplates: TemplateItem[] = [\n${makeupArray}\n];\n`);

  console.log('// YouCam Hair Templates (hair-style)');
  console.log(`const hairTemplates: TemplateItem[] = [\n${hairArray}\n];\n`);

  console.log(`\n✅  Total: ${makeupItems.length} makeup, ${hairItems.length} hair\n`);
}

function escapeString(s: string) {
  return s.replace(/'/g, "\\'").replace(/\n/g, ' ');
}

run().catch(console.error);
