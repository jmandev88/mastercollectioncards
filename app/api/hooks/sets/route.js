import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres"; // or your own Postgres pool if not using Vercel

export async function GET() {
  const sql = neon(process.env.DATABASE_URL);
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

    const inserted = [];

    // Loop through each set and insert as JSONB
    for (const set of sets) {
      const result = await sql`
        INSERT INTO pokemon_sets (detail)
        VALUES (${JSON.stringify(set)}::jsonb)
        ON CONFLICT DO NOTHING
        RETURNING id
      `;
      inserted.push(result.rows[0]?.id || null);
    }

    return NextResponse.json({
      success: true,
      inserted: inserted.filter(Boolean).length,
    });
  } catch (error) {
    console.error("Error inserting sets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
