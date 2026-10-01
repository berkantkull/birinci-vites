import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve('dist');
const basePath = '/birinci-vites/';

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolute) : [absolute];
  }));
  return files.flat();
}

const files = (await listFiles(outputDirectory))
  .filter(file => !file.endsWith(`${path.sep}sw.js`))
  .sort();
const urls = files.map(file => `${basePath}${path.relative(outputDirectory, file).split(path.sep).join('/')}`);
const fingerprint = createHash('sha256');
for (const file of files) fingerprint.update(await readFile(file));
const cacheName = `birinci-vites-${fingerprint.digest('hex').slice(0, 12)}`;

const serviceWorker = `const CACHE_NAME = ${JSON.stringify(cacheName)};
const APP_SHELL = ${JSON.stringify(urls)};
const HOME = ${JSON.stringify(`${basePath}index.html`)};

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('birinci-vites-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.pathname.startsWith(${JSON.stringify(basePath)})) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(HOME)));
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
`;

await writeFile(path.join(outputDirectory, 'sw.js'), serviceWorker, 'utf8');
console.log(`PWA service worker created with ${urls.length} cached files (${cacheName}).`);
