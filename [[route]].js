// Cloudflare Pages Function: /api/catalog (GET) and /api/order (POST)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfdq9xqSoDJ8NYX-7_Agf7LrKLaUNVHjo9Js2PUOPvDh3ZZIaEJSlectcvlZ7dwPLJxA/exec';
const J = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

export async function onRequest({ request, env }) {
  const url = env.SCRIPT_URL || SCRIPT_URL;
  if (request.method === 'POST') {
    const body = await request.text();
    if (body.length > 20000) return new Response('{"ok":false}', { status: 413, headers: J });
    const r = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' }, redirect: 'follow' });
    return new Response(await r.text(), { headers: J });
  }
  const r = await fetch(url, { cf: { cacheTtl: 60, cacheEverything: true } });
  return new Response(await r.text(), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' } });
}
