// netlify/functions/schedule.js
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, msg: "Functions are working!" })
  };
}
