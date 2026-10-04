const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfdq9xqSoDJ8NYX-7_Agf7LrKLaUNVHjo9Js2PUOPvDh3ZZIaEJSlectcvlZ7dwPLJxA/exec';

export async function onRequestPost({ request }) {
  const body = await request.text();

  if (body.length > 20000) {
    return new Response(
      JSON.stringify({ ok: false }),
      {
        status: 413,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'text/plain',
    },
    redirect: 'follow',
  });

  return new Response(await response.text(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}