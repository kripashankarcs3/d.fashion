import https from 'https';

const getUnsplashInfo = (photoId) => {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/photos/${photoId}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
        resolve({
          photoId,
          title: titleMatch ? titleMatch[1] : 'Unknown',
          description: metaMatch ? metaMatch[1] : ''
        });
      });
    }).on('error', () => resolve({ photoId, title: 'Error' }));
  });
};

const currentPhotos = [
  // Everyday
  { name: 'Classic Cotton T-Shirt', id: 'ee0c2909d518' }, // photo-1521572267360-ee0c2909d518
  { name: 'Relaxed Linen Shirt', id: '8936f5b7be1a' },
  { name: 'Essential Polo T-Shirt', id: '5690b299e5be' },
  { name: 'Everyday Chinos', id: '85924c800a22' },
  { name: 'Casual Denim Jeans', id: '780c96856592' },
  { name: 'Minimal Henley', id: 'e386cc2a3ccf' },
  { name: 'Cotton Kurta', id: '26f69add5d6e' },
  { name: 'Comfort Cargo Pants', id: 'bc9910d016b7' },

  // Traditional
  { name: 'Classic Dhoti Kurta', id: '7c31b7b14ad0' },
  { name: 'Traditional Pathani Suit', id: '8936f5b7be1a' },
  { name: 'Royal Achkan', id: '351597cf2477' },
  { name: 'Classic Kurta Pajama', id: '199ea26cfe3e' },
  { name: 'Traditional Angarkha', id: '26f69add5d6e' },
  { name: 'Silk Churidar Kurta', id: 'cad84cf45f1d' },
  { name: 'Heritage Bandhgala', id: 'c73779587ccf' },
  { name: 'Embroidered Nehru Jacket', id: '85924c800a22' }
];

async function run() {
  for (const item of currentPhotos) {
    const info = await getUnsplashInfo(item.id);
    console.log(`[${item.name}] ID: ${item.id} => TITLE: ${info.title.substring(0, 70)}`);
  }
}

run();
