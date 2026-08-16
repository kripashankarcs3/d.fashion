const fs = require('fs');
const pick = JSON.parse(fs.readFileSync('final-pick.json', 'utf8'));
const ids = new Set(pick.map(p => p.id));
const srcIds = ['37973750','37998083','40628224','38308203','37974486'];
const lpu = {};
for (const rid of srcIds) {
  const r = JSON.parse(fs.readFileSync('related-' + rid + '.json', 'utf8'));
  for (const rel of r.related) {
    for (const p of rel.products) {
      if (ids.has(String(p.id))) lpu[String(p.id)] = p.landingPageUrl;
    }
  }
}
for (const p of pick) p.buyUrl = 'https://www.myntra.com/' + (lpu[p.id] || '');
const missing = pick.filter(p => !lpu[p.id]);
console.log('missing lpu:', missing.map(p => p.id));
fs.writeFileSync('final-pick.json', JSON.stringify(pick, null, 2));
for (const p of pick) console.log(p.id, p.buyUrl.replace('https://www.myntra.com/', ''));
