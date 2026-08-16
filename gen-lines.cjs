const fs = require('fs');
const pick = JSON.parse(fs.readFileSync('final-pick.json', 'utf8'));
const cand = JSON.parse(fs.readFileSync('similar-candidates.json', 'utf8'));
const candMap = {};
for (const c of cand) candMap[c.id] = c.img;

const given = [
  { id: '37973750', name: 'SHYAM SUNDARI Floral Print Maxi Midi Dress', colour: '#C0B0A0', buyUrl: 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-floral-print-maxi-midi-dress/37973750/buy', img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2024/NOVEMBER/5/Z9r5eQYg_f6c8e5c3a8b84c13a9f6a0c7d5e8f8a6.jpg' },
  { id: '37998083', name: 'SHYAM SUNDARI Puff Sleeve A-Line Midi Dress', colour: '#C0B0A0', buyUrl: 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-puff-sleeve-a-line-midi-dress/37998083/buy', img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/16/XstQm14M_e292a7b94be546af936fa0daeff1eb77.jpg' },
  { id: '40628224', name: 'NAUTIFUL Floral Printed V-Neck Flutter Sleeves Fit & Flare Midi Dress', colour: '#F0F0F0', buyUrl: 'https://www.myntra.com/dresses/nautiful/nautiful-floral-printed-v-neck-flutter-sleeves-fit--flare-midi-dress/40628224/buy', img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2026/MARCH/12/mimB8nKl_3fc9e0ccef9f4f1db26ccc90d85119b8.jpg' },
  { id: '38308203', name: 'SHYAM SUNDARI Puff Sleeve A-Line Midi Dress', colour: '#D0D0C0', buyUrl: 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-puff-sleeve-a-line-midi-dress/38308203/buy', img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/28/UmAmdzKz_27143856e2fe4ff08a1e0aec98e79b29.jpg' },
  { id: '37974486', name: 'SHYAM SUNDARI Tie & Dye Dyed Puff Sleeve Bodycon Midi Dress', colour: '#E0D0C0', buyUrl: 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-tie-and-dye-dyed-puff-sleeve-bodycon-midi-dress/37974486/buy', img: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/2025/NOVEMBER/14/CkNrRIAp_9cd62bd4a826466883463d7cc9f2027a.jpg' },
];

for (const g of given) {
  if (!g.img && candMap[g.id]) g.img = candMap[g.id];
  console.log(g.id, g.img);
}

const skin = {
  '37973750': '#C0B0A0',
  '37998083': '#C0B0A0',
  '40628224': '#F0F0F0',
  '38308203': '#D0D0C0',
  '37974486': '#E0D0C0',
  '37974150': '#C0B0A0',
  '37998087': '#C0B0A0',
  '38308197': '#D0D0C0',
  '37998093': '#202040',
  '37974222': '#E0E0E0',
  '37974485': '#101010',
  '37974108': '#D0C0B0',
  '39039783': '#C0C0C0',
  '37998080': '#D0D0C0',
  '37974903': '#E0D0C0',
  '37974111': '#E0D0C0',
  '37974243': '#FFFFFF',
  '39360890': '#101010',
  '37974154': '#101010',
  '39639629': '#101010',
  '43098991': '#C0C0C0',
  '30722822': '#D0C0B0',
  '37802642': '#E0C0A0',
  '34443989': '#D0C0B0',
  '39679037': '#807060',
  '36656718': '#FFFFFF',
  '32670088': '#F0F0F0',
  '37720313': '#908080',
  '35274483': '#E0D0C0',
  '31419384': '#E0E0F0',
  '40180641': '#C0C0C0',
  '32417127': '#F0D0A0',
  '37862655': '#E0E0E0',
  '30722824': '#E0D0C0',
  '37966766': '#C09070',
  '32882481': '#D0C0B0',
  '33729214': '#D0D0C0',
  '34234724': '#C0B080',
  '31375705': '#D09080',
  '38834822': '#605040',
};

function hexToColourName(hex) {
  const h = hex.replace('#', '').toUpperCase();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  
  if (r > 240 && g > 240 && b > 240) return 'Pure White';
  if (r < 30 && g < 30 && b < 30) return 'Onyx Black';
  if (r > 200 && g > 180 && b < 100) return 'Marigold';
  if (r > 200 && g > 150 && b < 100) return 'Amber';
  if (r > 180 && g > 160 && b > 120) return 'Khaki Tan';
  if (r > 180 && g > 140 && b > 100) return 'Sand';
  if (r > 180 && g < 100 && b < 100) return 'Coral';
  if (r > 160 && g < 80 && b < 80) return 'Crimson';
  if (r > 140 && g < 80 && b > 140) return 'Violet';
  if (r < 100 && g > 140 && b < 100) return 'Emerald';
  if (r < 100 && g < 100 && b > 180) return 'Royal Blue';
  if (r < 100 && g > 140 && b > 180) return 'Sky Blue';
  if (r > 140 && g > 100 && b > 160) return 'Blush Pink';
  if (r > 120 && g > 100 && b > 120) return 'Mauve';
  if (r > 100 && g > 80 && b < 80) return 'Terracotta';
  if (r < 80 && g < 80 && b > 120) return 'Indigo';
  if (r > 200 && g > 180 && b > 180) return 'Ivory';
  if (r > 180 && g > 170 && b > 150) return 'Beige';
  if (r > 160 && g > 150 && b > 130) return 'Taupe';
  if (r > 140 && g > 130 && b > 110) return 'Mushroom';
  if (r > 120 && g > 110 && b > 90) return 'Grey Beige';
  if (r > 100 && g > 90 && b > 80) return 'Stone';
  if (r > 80 && g > 70 && b > 60) return 'Charcoal';
  if (r > 60 && g > 50 && b > 40) return 'Dark Grey';
  if (r > 220 && g > 200 && b > 180) return 'Off White';
  if (r > 200 && g > 190 && b > 170) return 'Pearl';
  if (r > 230 && g > 220 && b > 200) return 'Cream';
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 30) {
    if (max > 200) return 'Light Grey';
    if (max > 150) return 'Medium Grey';
    if (max > 100) return 'Grey';
    return 'Dark Grey';
  }
  if (r >= g && r >= b) return 'Reddish';
  if (g >= r && g >= b) return 'Greenish';
  return 'Bluish';
}

const all = [...given];
for (const p of pick) {
  const id = p.id;
  const hex = skin[id] || '#808080';
  const img = candMap[id] || `https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/${id}.jpg`;
  all.push({
    id,
    name: p.name,
    colour: hex,
    buyUrl: p.buyUrl,
    img
  });
}

let id = 121;
const lines = all.map(item => {
  const colourName = hexToColourName(item.colour);
  return `  { id: ${id++}, category: "Everyday", gender: 'Women', name: "${item.name.replace(/"/g, '\\"')}", img: "${item.img}", colourHex: "${item.colour}", colourName: "${colourName}", buyUrl: "${item.buyUrl}" },`;
});

fs.writeFileSync('everyday-lines.ts', lines.join('\n'));
console.log(lines.join('\n'));