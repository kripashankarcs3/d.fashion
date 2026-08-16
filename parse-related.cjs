const fs = require('fs');
const ids = ['37973750','37998083','40628224','38308203','37974486'];
const all = [];
for (const id of ids) {
  const j = JSON.parse(fs.readFileSync(`related-${id}.json`, 'utf8'));
  for (const r of j.related || []) {
    const t = r.type || '?';
    for (const p of r.products || []) {
      const img = (p.defaultImage && p.defaultImage.secureSrc || '')
        .replace(/h_\(\$height\),q_\(\$qualityPercentage\),w_\(\$width\)/, 'h_1440,q_100,w_1080')
        .replace(/h_200,w_200,c_fill,g_auto/, 'h_1440,q_100,w_1080')
        .replace('http://', 'https://');
      all.push({
        id: String(p.id),
        name: p.name,
        brand: p.brand && p.brand.name,
        colour: p.baseColour,
        img,
        type: t,
        srcId: id,
      });
    }
  }
}
// dedupe by id keep first
const seen = new Set();
const uniq = all.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
fs.writeFileSync('related-products.json', JSON.stringify(uniq, null, 2));
console.log('total entries', all.length, 'unique', uniq.length);
const types = {};
for (const p of uniq) types[p.type] = (types[p.type]||0)+1;
console.log(types);
// names sample
for (const p of uniq.slice(0, 40)) {
  console.log(p.id, '|', p.type, '|', p.brand, '|', p.colour, '|', p.name);
}
