
const queries = [
  { key: 'men_kurta', q: 'man indian kurta' },
  { key: 'men_sherwani', q: 'man sherwani' },
  { key: 'men_suit', q: 'man formal suit' },
  { key: 'men_tuxedo', q: 'man tuxedo' },
  { key: 'men_blazer', q: 'man blazer' },
  { key: 'men_jacket', q: 'man jacket fashion' },
  { key: 'men_shirt', q: 'male model shirt' },
  { key: 'men_jeans', q: 'male model jeans' },
  { key: 'men_trousers', q: 'man formal trousers' },
];

async function check() {
  for (const item of queries) {
    try {
      const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(item.q)}&per_page=10`);
      const data = await res.json();
      console.log(`=== ${item.key} (${item.q}) ===`);
      if (data.results) {
        data.results.slice(0, 5).forEach((r, i) => {
          console.log(`  ${i+1}. ID: ${r.id} | Alt: ${r.alt_description} | URL: https://images.unsplash.com/photo-${r.id}?w=600&q=80`);
        });
      }
    } catch (e) {
      console.error(`Failed ${item.key}:`, e.message);
    }
  }
}

check();
