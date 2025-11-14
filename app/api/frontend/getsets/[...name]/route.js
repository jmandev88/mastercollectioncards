import { neon } from "@neondatabase/serverless";

const sql = neon(
  "postgresql://neondb_owner:npg_8eHU7FbVTpvD@ep-rapid-pond-ahorbczd-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
);

// Simple in-memory cache
let cache = new Map();
let cacheTimes = new Map();
const TTL = 60 * 1000; // 1 minute

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("name");

    const now = Date.now();
    const cached = cache.get(id);
    const cachedTime = cacheTimes.get(id) || 0;

    // ✅ Serve fresh cache immediately
    if (cached && now - cachedTime < TTL) {
      return new Response(JSON.stringify({ data: cached }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔄 Background refresh (does NOT block request)
    (async () => {
      try {
        const freshRows =
          await sql`SELECT * FROM "sets" WHERE set_id = ${id} ORDER BY id ASC`;

        const freshData = freshRows.map((row) => ({
          id: row.id,
          details: row,
        }));

        cache.set(id, freshData);
        cacheTimes.set(id, Date.now());
      } catch (err) {
        console.error("Background refresh failed", err);
      }
    })();

    // 🕒 If stale cache exists, serve it immediately
    if (cached) {
      return new Response(JSON.stringify({ data: cached }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ❄️ No cache yet → fetch immediately
    const rows =
      await sql`SELECT * FROM "sets" WHERE set_id = ${id} ORDER BY id ASC`;

    const dataWithIds = rows.map((row) => ({
      id: row.id,
      details: row,
    }));

    cache.set(id, dataWithIds);
    cacheTimes.set(id, now);

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
