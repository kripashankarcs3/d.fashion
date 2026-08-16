import https from 'https';

https.get('https://unsplash.com/s/photos/kurta-men', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
}, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    console.log("STATUS:", res.statusCode);
    console.log("HTML LEN:", html.length);
    console.log("Snippet:", html.substring(0, 500));
    // search for images.unsplash.com
    const matches = html.match(/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g);
    console.log("Photo matches:", matches ? matches.slice(0, 10) : "None");
  });
});
