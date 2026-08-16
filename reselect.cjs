const fs = require('fs');
const cand = JSON.parse(fs.readFileSync('similar-candidates.json', 'utf8'));
const skinFile = fs.readFileSync('C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\skincheck-cand.txt', 'utf16le');
const skin = {};
for (const line of skinFile.split('\n')) {
  const m = line.match(/^(\d+)\.jpg\s+([\d\.]+)/);
  if (m) skin[m[1]] = parseFloat(m[2]);
}
const good = cand.filter(p => (skin[p.id] || 0) >= 10);
console.log('good skin candidates:', good.length);

const sameBrand = good.filter(p => p.brand === 'SHYAM SUNDARI');
const others = good.filter(p => p.brand !== 'SHYAM SUNDARI');
// sort others by brand to get variety but keep SHYAM SUNDARI first
const pick = [];
const nameCount = {};
const addCand = (arr) => {
  for (const p of arr) {
    if (pick.length >= 35) break;
    const base = p.name.replace(/\s*(Fuchsia|Maroon|Navy Blue|Purple|Black|Blue|Green|Beige|Brown|White|Grey|Red|Pink|Olive|Yellow|Off White|Multi|Lime Green)\s*$/i, '').trim();
    nameCount[base] = (nameCount[base] || 0) + 1;
    if (nameCount[base] > 3) continue;
    pick.push({ ...p, skin: skin[p.id] });
  }
};
addCand(sameBrand);
addCand(others);
console.log('picked:', pick.length);
fs.writeFileSync('final-pick.json', JSON.stringify(pick, null, 2));
for (const p of pick) console.log(p.id, p.brand, p.colour, 'skin=' + p.skin, p.name);
