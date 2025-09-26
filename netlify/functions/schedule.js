// netlify/functions/schedule.js
export async function handler(event, context) {
  try {
    const res = await fetch("https://statsapi.web.nhl.com/api/v1/schedule?teamId=8&season=20252026&expand=schedule.broadcasts");

    if (!res.ok) {
      throw new Error(`NHL API error: ${res.status}`);
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() }),
    };
  }
}
