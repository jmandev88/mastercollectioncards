import { neon } from "@neondatabase/serverless";

const sql = neon(
  "postgresql://neondb_owner:npg_8eHU7FbVTpvD@ep-rapid-pond-ahorbczd-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { userid, setName, cardId, action } = body;
    // action: "add" or "remove"

    if (!userid || !setName || !cardId) {
      return new Response(
        JSON.stringify({ error: "Missing userid, setName, or cardId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const metaKey = `collections_${setName}`;
    const existing =
      await sql`SELECT id, meta_value FROM users_meta WHERE users_id = ${userid} AND meta_key = ${metaKey}`;

    let updatedArray = [];

    if (existing.length > 0) {
      // Parse current array
      const currentString = existing[0].meta_value || "[]";
      let currentArray;
      try {
        currentArray = JSON.parse(currentString);
      } catch {
        currentArray = [];
      }

      if (action === "remove") {
        updatedArray = currentArray.filter((id) => id !== cardId);
      } else {
        // Add
        if (!currentArray.includes(cardId)) {
          currentArray.push(cardId);
        }
        updatedArray = currentArray;
      }

      await sql`
        UPDATE users_meta
        SET meta_value = ${JSON.stringify(updatedArray)}
        WHERE id = ${existing[0].id};
      `;
    } else {
      if (action === "add") {
        updatedArray = [cardId];
        await sql`
          INSERT INTO users_meta (users_id, meta_key, meta_value)
          VALUES (${userid}, ${metaKey}, ${JSON.stringify(updatedArray)});
        `;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        meta_key: metaKey,
        meta_value: JSON.stringify(updatedArray),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Failed to update collection", error);
    return new Response(
      JSON.stringify({ error: "Failed to update collection" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
