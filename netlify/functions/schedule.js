// netlify/functions/schedule.js
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function handler(event, context) {
  try {
    // Go up to /data/schedule.json
    const filePath = path.join(__dirname, "../../data/schedule.json");
    const data = await readFile(filePath, "utf-8");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
