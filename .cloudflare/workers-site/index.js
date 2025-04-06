import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    let options = {};
    return await getAssetFromKV(event, options);
  } catch (e) {
    let pathname = new URL(event.request.url).pathname;
    return new Response(`"${pathname}" not found`, { status: 404 });
  }
}
