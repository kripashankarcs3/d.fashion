const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sel = JSON.parse(fs.readFileSync('selected.json', 'utf8'));
const all = [...sel.given, ...sel.similar];
const dir = 'C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\imgs';
fs.mkdirSync(dir, { recursive: true });

const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const uaB64 = Buffer.from(ua).toString('base64');

for (const p of all) {
  const file = path.join(dir, p.id + '.jpg');
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    const url = p.img.replace(/h_\(\$height\),q_\(\$qualityPercentage\),w_\(\$width\)/g, 'h_1440,q_100,w_1080');
    try {
      execSync(`curl.exe -s -o "${file}" -A "${ua}" --max-time 60 "${url}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
  const sz = fs.existsSync(file) ? fs.statSync(file).size : 0;
  console.log(p.id, sz);
}
