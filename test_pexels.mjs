import https from 'https';

https.get('https://www.pexels.com/search/mens%20suit/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    console.log("STATUS:", res.statusCode);
    const matches = html.match(/https:\/\/images\.pexels\.com\/photos\/[0-9]+\/pexels-photo-[0-9]+\.[a-z]+/g);
    console.log("PEXELS MATCHES:", matches ? [...new Set(matches)].slice(0, 10) : "NONE");
  });
});
