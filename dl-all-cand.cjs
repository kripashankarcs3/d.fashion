const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cand = JSON.parse(fs.readFileSync('similar-candidates.json', 'utf8'));
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const dir = 'C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\cand';
fs.mkdirSync(dir, { recursive: true });
for (const p of cand) {
  const file = path.join(dir, p.id + '.jpg');
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    try {
      execSync(`curl.exe -s -o "${file}" -A "${ua}" --max-time 60 "${p.img}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
}
console.log('done');
