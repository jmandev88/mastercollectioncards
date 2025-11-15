import { neon } from "@neondatabase/serverless";

const sql = neon(
  "postgresql://neondb_owner:npg_8eHU7FbVTpvD@ep-rapid-pond-ahorbczd-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
);

let cache = new Map();
let cacheTimes = new Map();
const TTL = 60 * 1000; // 1 minute

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("name");
    const cacheKey = id || "all-sets"; // Use proper cache key

    const now = Date.now();
    const cached = cache.get(cacheKey);
    const cachedTime = cacheTimes.get(cacheKey) || 0;

    // ✅ Return cache immediately if fresh
    if (cached && now - cachedTime < TTL) {
      return new Response(JSON.stringify({ data: cached }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔄 Background refresh — doesn't block user
    (async () => {
      try {
        const fresh = await sql`SELECT * FROM "sets" ORDER BY id DESC`;
        cache.set(cacheKey, fresh);
        cacheTimes.set(cacheKey, Date.now());
      } catch (err) {
        console.error("Background refresh failed", err);
      }
    })();

    // Serve stale cache if available
    if (cached) {
      return new Response(JSON.stringify({ data: cached }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ❄️ If no cache yet (first request), fetch directly
    const rows = await sql`SELECT * FROM "sets" ORDER BY id DESC`;
    cache.set(cacheKey, rows);
    cacheTimes.set(cacheKey, now);

    // 🧩 Include the id field explicitly for clarity
    const dataWithIds = rows.map((row) => ({
      id: row.id, // 👈 explicit id
      details: row, // your card data
    }));

    return new Response(JSON.stringify({ data: dataWithIds }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch cards", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cards" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
