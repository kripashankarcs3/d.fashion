const fs = require('fs');
const cand = JSON.parse(fs.readFileSync('similar-candidates.json', 'utf8'));
const given = [
  { id: '37973750', name: 'SHYAM SUNDARI Floral Print Maxi Midi Dress', brand: 'SHYAM SUNDARI', colour: 'Beige',
    img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/14/h9PojmUn_5b7b8579098245a58bde542204f64475.jpg' },
  { id: '37998083', name: 'SHYAM SUNDARI Puff Sleeve A-Line Midi Dress', brand: 'SHYAM SUNDARI', colour: 'Navy Blue',
    img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/16/XLXxL4nZ_c7b2bc5bce8a4d68a4a33a56781776aa.jpg' },
  { id: '40628224', name: 'Nautiful Floral Printed V-Neck Flutter Sleeves Fit & Flare Midi Dress', brand: 'Nautiful', colour: 'Black',
    img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/12/mimB8nKl_3fc9e0ccef9f4f1db26ccc90d85119b8.jpg' },
  { id: '38308203', name: 'SHYAM SUNDARI Puff Sleeve A-Line Midi Dress', brand: 'SHYAM SUNDARI', colour: 'Purple',
    img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/28/UmAmdzKz_27143856e2fe4ff08a1e0aec98e79b29.jpg' },
  { id: '37974486', name: 'SHYAM SUNDARI Tie and Dye Dyed Puff Sleeve Bodycon Midi Dress', brand: 'SHYAM SUNDARI', colour: 'Green',
    img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/14/CkNrRIAp_9cd62bd4a826466883463d7cc9f2027a.jpg' },
];
// take 35 candidates: prefer same-brand (SHYAM SUNDARI) first, then others in order
const sameBrand = cand.filter(p => p.brand === 'SHYAM SUNDARI');
const others = cand.filter(p => p.brand !== 'SHYAM SUNDARI');
// avoid too many identical-name colour dupes of the same style? keep but cap same-name
const pick = [];
const nameCount = {};
const addCand = (arr) => {
  for (const p of arr) {
    if (pick.length >= 35) break;
    const base = p.name.replace(/\s*(Fuchsia|Maroon|Navy Blue|Purple|Black|Blue|Green|Beige|Brown|White|Grey|Red|Pink|Olive|Yellow|Off White|Multi|Lime Green)\s*$/i, '').trim();
    nameCount[base] = (nameCount[base] || 0) + 1;
    if (nameCount[base] > 3) continue; // cap 3 per style
    pick.push(p);
  }
};
addCand(sameBrand);
addCand(others);
console.log('picked similar:', pick.length);
const selected = { given, similar: pick };
fs.writeFileSync('selected.json', JSON.stringify(selected, null, 2));
for (const p of pick) console.log(p.id, p.brand, p.colour, p.name);
