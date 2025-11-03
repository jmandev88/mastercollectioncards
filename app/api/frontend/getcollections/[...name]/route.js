import { neon } from "@neondatabase/serverless";

const sql = neon(
  "postgresql://neondb_owner:npg_8eHU7FbVTpvD@ep-rapid-pond-ahorbczd-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
);

// simple in-memory cache (keyed by client id)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = "collections_" + searchParams.get("name");
    const userid = searchParams.get("userid");

    if (!name) {
      return new Response(
        JSON.stringify({ error: "Missing name query param" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const rows =
      await sql`SELECT * FROM "users_meta" WHERE users_id = ${userid} AND meta_key = ${name}`;

    return new Response(JSON.stringify({ data: rows[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch client", error);
    return new Response(JSON.stringify({ error: "Failed to fetch client" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
