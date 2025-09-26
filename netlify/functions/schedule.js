import schedule from "./schedule.json" assert { type: "json" };

export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule)
  };
}
