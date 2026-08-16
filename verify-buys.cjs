const fs = require('fs');
const { execSync } = require('child_process');
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const given = [
  ['37973750', 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-floral-print-maxi-midi-dress/37973750/buy'],
  ['37998083', 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-puff-sleeve-a-line-midi-dress/37998083/buy'],
  ['40628224', 'https://www.myntra.com/dresses/nautiful/nautiful-floral-printed-v-neck-flutter-sleeves-fit--flare-midi-dress/40628224/buy'],
  ['38308203', 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-puff-sleeve-a-line-midi-dress/38308203/buy'],
  ['37974486', 'https://www.myntra.com/dresses/shyam+sundari/shyam-sundari-tie-and-dye-dyed-puff-sleeve-bodycon-midi-dress/37974486/buy'],
];
const pick = JSON.parse(fs.readFileSync('final-pick.json', 'utf8'));
const items = [...given, ...pick.map(p => [p.id, p.buyUrl])];
const bad = [];
for (const [id, url] of items) {
  let code;
  try {
    code = execSync(`curl.exe -s -o NUL -A "${ua}" -w "%{http_code}" -L --max-time 40 "${url}"`, { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] }).trim();
  } catch (e) { code = 'ERR'; }
  if (code !== '200') bad.push([id, code, url]);
  console.log(id, code);
}
console.log('BAD:', JSON.stringify(bad));
