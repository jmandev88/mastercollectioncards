import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(
  "postgresql://neondb_owner:npg_8eHU7FbVTpvD@ep-rapid-pond-ahorbczd-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
);

export async function GET() {
  try {
    // Fetch Pokémon TCG sets
    const response = await fetch("https://api.pokemontcg.io/v2/sets", {
      headers: {
        "X-Api-Key": "60dac11b-194d-4f78-bbb8-055adbee3f48",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const sets = json.data;

    if (!Array.isArray(sets)) {
      throw new Error("Invalid response format: expected an array in data");
    }

    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-11-03"
    const inserted = [];
    const skipped = [];

    for (const set of sets) {
      // Normalize date from "YYYY/MM/DD HH:mm:ss" → "YYYY-MM-DD"
      const updatedDate = set.updatedAt?.split(" ")[0]?.replace(/\//g, "-");
      // Only insert/update if the date matches today
      if (updatedDate === today) {
        // const result = await sql`
        //     INSERT INTO sets (set_id, details)
        //     VALUES (${set.id}, ${JSON.stringify(set)}::jsonb)
        //     RETURNING id;
        //   `;
        //   // inserted.push(result[0]?.id || null);
      } else {
        skipped.push(set.id);
      }
    }

    return NextResponse.json({
      success: true,
      inserted: inserted.filter(Boolean).length,
      skipped: skipped.length,
      skipped_ids: skipped,
    });
  } catch (error) {
    console.error("Error inserting sets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
