const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfdq9xqSoDJ8NYX-7_Agf7LrKLaUNVHjo9Js2PUOPvDh3ZZIaEJSlectcvlZ7dwPLJxA/exec';

export async function onRequestGet() {
  const response = await fetch(SCRIPT_URL);

  return new Response(await response.text(), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}