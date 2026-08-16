const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dir = 'C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\pages';
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const ids = ['32660205','37974116','37974489','37976756','37998085','39230108','39360894','39640496','39671168','40180649','40180656'];
const imgsDir = 'C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\albums';
fs.mkdirSync(imgsDir, { recursive: true });
for (const id of ids) {
  const urls = JSON.parse(fs.readFileSync(dir + '\\album-' + id + '.json', 'utf8'));
  urls.forEach((u, idx) => {
    const file = path.join(imgsDir, `${id}_${idx}.jpg`);
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      try {
        execSync(`curl.exe -s -o "${file}" -A "${ua}" --max-time 60 "${u}"`, { stdio: 'pipe' });
      } catch (e) {}
    }
  });
  console.log(id, 'downloaded', urls.length);
}
