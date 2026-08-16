import https from 'https';

function searchUnsplashNextData(searchTerm) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/s/photos/${encodeURIComponent(searchTerm)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        try {
          const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
          if (match) {
            const data = JSON.parse(match[1]);
            const photos = [];
            // Walk JSON object to find photo objects
            const jsonStr = match[1];
            // Extract raw photo URLs and alt descriptions using regex from the JSON string
            const photoMatches = [...jsonStr.matchAll(/"raw":"(https:\/\/images\.unsplash\.com\/photo-[^"?]+)"[^}]*?"alt_description":"([^"]+)"/g)];
            for (const m of photoMatches) {
              photos.push({ url: m[1] + '?w=600&q=80', alt: m[2] });
            }
            resolve(photos);
          } else {
            // Alternative regex directly on html
            const photoMatches = [...html.matchAll(/"raw":"(https:\/\/images\.unsplash\.com\/photo-[^"?]+)"/g)];
            resolve(photoMatches.map(m => ({ url: m[1] + '?w=600&q=80', alt: 'Photo' })));
          }
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function test() {
  const terms = ['kurta-men', 'sherwani', 'men-suit', 'men-tshirt', 'jeans-pant', 'blazer-men'];
  for (const t of terms) {
    const results = await searchUnsplashNextData(t);
    console.log(`\n=== SEARCH: ${t} (Found ${results.length}) ===`);
    results.slice(0, 5).forEach((r, idx) => {
      console.log(`${idx + 1}. ALT: ${r.alt}`);
      console.log(`   URL: ${r.url}`);
    });
  }
}

test();
