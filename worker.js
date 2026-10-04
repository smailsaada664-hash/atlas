// Atlas — Cloudflare Worker entry point.
// Routes: GET / -> index.html, GET /api/catalog -> Apps Script, POST /api/order -> Apps Script.
import INDEX_HTML from './index.html';

const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyfdq9xqSoDJ8NYX-7_Agf7LrKLaUNVHjo9Js2PUOPvDh3ZZIaEJSlectcvlZ7dwPLJxA/exec';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

async function callScript(env, init) {
  const url = env.SCRIPT_URL || DEFAULT_SCRIPT_URL;
  const res = await fetch(url, { ...init, redirect: 'follow' });
  const type = res.headers.get('content-type') || '';

  // Apps Script answers a non-public deployment with the Google sign-in page,
  // which would otherwise reach the browser labelled as JSON.
  if (!type.includes('json')) {
    return json({ ok: false, error: 'upstream_not_json' }, 502);
  }

  return new Response(await res.text(), { status: res.status, headers: JSON_HEADERS });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/catalog') {
      if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405);
      return callScript(env, { method: 'GET' });
    }

    if (pathname === '/api/order') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      const body = await request.text();
      if (body.length > 20000) return json({ ok: false }, 413);
      return callScript(env, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    if (pathname === '/' || pathname === '/index.html') {
      return new Response(INDEX_HTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    return json({ ok: false, error: 'not_found' }, 404);
  },
};