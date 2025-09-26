// netlify/functions/schedule.js
import fetch from "node-fetch";   // <-- important

export async function handler(event, context) {
  try {
    const res = await fetch(
      "https://statsapi.web.nhl.com/api/v1/schedule?teamId=8&season=20252026&expand=schedule.broadcasts",
      {
        headers: {
          "User-Agent": "HabsBlackoutApp/1.0"
        }
      }
    );

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
