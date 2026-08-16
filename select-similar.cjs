const fs = require('fs');
const c = fs.readFileSync('src/pages/TryOn.tsx', 'utf8');
const existing = new Set([...c.matchAll(/myntra\.com[^"']*?\/(\d{8})\/buy/g)].map(m => m[1]));
const given = ['37973750','37998083','40628224','38308203','37974486'];
const sim = JSON.parse(fs.readFileSync('similar-pool.json', 'utf8'));
const cand = sim.filter(p => !existing.has(p.id));
console.log('similar available (not in file, not given):', cand.length);
// check against given too
const cand2 = cand.filter(p => !given.includes(p.id));
console.log('after removing given:', cand2.length);
// brand distribution
const brands = {};
for (const p of cand2) brands[p.brand] = (brands[p.brand]||0)+1;
console.log(brands);
fs.writeFileSync('similar-candidates.json', JSON.stringify(cand2, null, 2));
