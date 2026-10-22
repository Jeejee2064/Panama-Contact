// Pushes every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver...).
// Run after each deploy:  node scripts/indexnow.mjs
const KEY = '7b4b9bcbd9fba4fb14e79fe3c878e2b8';
const HOST = 'www.panama-contact.com';

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

for (let i = 0; i < urlList.length; i += 9000) {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urlList.slice(i, i + 9000) }),
  });
  console.log(`IndexNow: ${urlList.length} URLs submitted → HTTP ${res.status}`);
}
