const fs = require('fs');
const cand = JSON.parse(fs.readFileSync('similar-candidates.json', 'utf8'));
const dresses = cand.filter(p => (p.type === 'Similar' && (p.articleType === 'Dresses' || /dress/i.test(p.name))));
console.log('dress-type candidates:', dresses.length);
// also check articleType field presence
let withAT = 0;
for (const p of cand) if (p.articleType) withAT++;
console.log('with articleType field:', withAT, '/', cand.length);
fs.writeFileSync('similar-dresses.json', JSON.stringify(dresses, null, 2));
