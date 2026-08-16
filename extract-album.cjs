const fs = require('fs');
const dir = 'C:\\Users\\kripa\\AppData\\Local\\Temp\\opencode\\everyday\\pages';
const ids = ['32660205','37974116','37974489','37976756','37998085','39230108','39360894','39640496','39671168','40180649','40180656'];

for (const id of ids) {
  const c = fs.readFileSync(dir + '\\page-' + id + '.html', 'utf8');
  const i = c.indexOf('pdpData');
  if (i === -1) { console.log(id, 'no pdpData'); continue; }
  const j = c.indexOf('"albums":[', i);
  if (j === -1) { console.log(id, 'no albums'); continue; }
  // extract images array from albums json via brace matching
  const start = c.indexOf('"images":[', j);
  const urls = [];
  if (start !== -1) {
    let depth = 0; let k = start;
    while (k < c.length) {
      if (c[k] === '[') depth++;
      else if (c[k] === ']') { depth--; if (depth === 0) break; }
      k++;
    }
    const arrStr = c.substring(start, k + 1);
    for (const m of arrStr.matchAll(/"secureSrc":"([^"]+?\.jpg)"/g)) {
      urls.push(m[1]);
    }
  }
  const clean = urls.map(u => u
    .replace(/\\u002F/g, '/')
    .replace(/h_\(\$height\),q_\(\$qualityPercentage\),w_\(\$width\)/g, 'h_1440,q_100,w_1080')
    .replace(/h_200,w_200,c_fill,g_auto/g, 'h_1440,q_100,w_1080')
    .replace('http://', 'https://')
  );
  fs.writeFileSync(dir + '\\album-' + id + '.json', JSON.stringify(clean, null, 2));
  console.log(id, 'album images:', clean.length);
  clean.slice(0, 5).forEach((u, idx) => console.log('  ', idx, u));
}
