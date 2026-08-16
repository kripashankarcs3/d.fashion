const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pick = JSON.parse(fs.readFileSync('final-pick.json', 'utf8'));
const givenIds = ['37973750','37998083','40628224','38308203','37974486'];
const all = [
  ...givenIds.map(id => ({ id, imgPath: `C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\imgs\\${id}.jpg` })),
  ...pick.map(p => ({ id: p.id, imgPath: `C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\cand\\${p.id}.jpg` }))
];

// Use ImageMagick identify to get dominant colour
// Or use a simple approach: read a few pixels from the center
const results = [];
for (const item of all) {
  try {
    // Use ImageMagick convert to get histogram and dominant colour
    const out = execSync(`magick identify -format "%[hex:p{0,0}]" "${item.imgPath}"`, { encoding: 'utf8', timeout: 10000 }).trim();
    // That's just corner pixel. Better: resize to 1x1 and get pixel
    const avg = execSync(`magick "${item.imgPath}" -resize 1x1! -format "%[hex:p{0,0}]" info:`, { encoding: 'utf8', timeout: 10000 }).trim();
    results.push({ id: item.id, colour: avg.startsWith('#') ? avg : '#' + avg });
  } catch (e) {
    results.push({ id: item.id, colour: '#808080' });
  }
}

fs.writeFileSync('colours.json', JSON.stringify(results, null, 2));
console.log(results);