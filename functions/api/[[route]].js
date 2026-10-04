const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyfdq9xqSoDJ8NYX-7_Agf7LrKLaUNVHjo9Js2PUOPvDh3ZZIaEJSlectcvlZ7dwPLJxA/exec';

const J = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

export async function onRequest({ request, env }) {
  const url = env.SCRIPT_URL || SCRIPT_URL;

  if (request.method === 'POST') {
    const body = await request.text();

    if (body.length > 20000) {
      return new Response(
        JSON.stringify({ ok: false }),
        {
          status: 413,
          headers: J,
        }
      );
    }

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'text/plain',
      },
      redirect: 'follow',
    });

    return new Response(await response.text(), {
      headers: J,
    });
  }

  const response = await fetch(url, {
    cf: {
      cacheTtl: 60,
      cacheEverything: true,
    },
  });

  return new Response(await response.text(), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  });
}