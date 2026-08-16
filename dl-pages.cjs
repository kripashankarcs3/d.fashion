const { execSync } = require('child_process');
const fs = require('fs');
const low = JSON.parse(fs.readFileSync('low-products.json', 'utf8'));
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const dir = 'C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\pages';
fs.mkdirSync(dir, { recursive: true });
for (const id of Object.keys(low)) {
  const file = dir + '\\page-' + id + '.html';
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    const url = 'https://www.myntra.com/' + low[id].landingPageUrl;
    try {
      execSync(`curl.exe -s -o "${file}" -A "${ua}" -L --max-time 60 "${url}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
  const sz = fs.existsSync(file) ? fs.statSync(file).size : 0;
  console.log(id, sz);
}
