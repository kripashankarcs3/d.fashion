const fs = require('fs');
const c = fs.readFileSync('src/pages/TryOn.tsx', 'utf8');
const ids = [...c.matchAll(/myntra\.com[^"']*?\/(\d{8})\/buy/g)].map(m => m[1]);
console.log('existing myntra ids in file:', ids.length);
const given = ['37973750','37998083','40628224','38308203','37974486'];
for (const g of given) { console.log(g, ids.includes(g) ? 'EXISTS' : 'new'); }
