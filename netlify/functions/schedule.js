import { readFile } from "fs/promises";
import path from "path";

export async function handler(event, context) {
  try {
    // Build a path to the JSON file
    const filePath = path.resolve("data/schedule.json");
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
