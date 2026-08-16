import fs from 'fs';

const content = fs.readFileSync('src/pages/TryOn.tsx', 'utf8');
const regex = /img:\s*['"]([^'"]+)['"]/g;
let match;
const urls = [];
while ((match = regex.exec(content)) !== null) {
  urls.push(match[1]);
}

console.log(`Found ${urls.length} garment URLs in TryOn.tsx`);

async function testAll() {
  const bad = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    if (u.startsWith('/')) continue; // local file
    try {
      const res = await fetch(u, { method: 'HEAD' });
      if (res.status !== 200) {
        console.log(`[BAD ${res.status}] Item #${i+1}: ${u}`);
        bad.push(u);
      } else {
        console.log(`[OK 200] Item #${i+1}: ${u}`);
      }
    } catch (e) {
      console.log(`[ERROR] Item #${i+1}: ${u} - ${e.message}`);
      bad.push(u);
    }
  }
  console.log(`\nTOTAL BAD URLs: ${bad.length}`);
}

testAll();
