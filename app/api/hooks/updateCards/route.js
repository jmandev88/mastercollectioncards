import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL); // use environment variable for safety

export async function GET() {
  try {
    // 🕒 Get yesterday's date in "YYYY/MM/DD" format (Pokémon API style)
    const today = new Date();
    today.setDate(today.getDate() - 1); // move one day back
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}/${mm}/${dd}`;

    console.log("Fetching cards updated on:", formattedDate);

    const page = 1;
    const pageSize = 250; // API max per page (PokémonTCG.io default)

    // 🔗 Fetch one page of updated cards
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=cardmarket.updatedAt:"${formattedDate}"&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          "X-Api-Key": "60dac11b-194d-4f78-bbb8-055adbee3f48",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Pokémon TCG API error: ${response.status}`);
    }

    const data = await response.json();
    const cards = data?.data || [];
    let totalInserted = 0;

    console.log(`Processing ${cards.length} cards from page ${page}`);

    // 🗃️ Insert or update cards
    for (const card of cards) {
      await sql`
          INSERT INTO cards (set_id, details)
          VALUES (${card.set.id}, ${JSON.stringify(card)}::jsonb)
      `;
      totalInserted++;
    }

    return NextResponse.json({
      success: true,
      totalInserted,
      date: formattedDate,
    });
  } catch (error) {
    console.error("Error syncing cards:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
