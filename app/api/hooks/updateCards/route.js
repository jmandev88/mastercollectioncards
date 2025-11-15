import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // 🔢 Read page number from query
    const page = Number(searchParams.get("page") || "1");
    const pageSize = 100;

    // 📅 Optional date override (format: YYYY/MM/DD)
    let formattedDate = searchParams.get("date");

    // If no custom date provided → use yesterday
    if (!formattedDate) {
      const d = new Date();
      d.setDate(d.getDate() - 1);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      formattedDate = `${yyyy}/${mm}/${dd}`;
    }

    console.log(`Fetching cards for ${formattedDate}, page ${page}`);

    const url = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`;
    // const url = `https://api.pokemontcg.io/v2/cards?q=cardmarket.updatedAt:"${formattedDate}"&page=${page}&pageSize=${pageSize}`;

    const response = await fetch(url, {
      headers: { "X-Api-Key": process.env.POKEMON_TCG_API_KEY },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Pokémon API error: ${response.status} - ${url}`);
    }

    const data = await response.json();
    const cards = data?.data || [];

    console.log(`Inserting ${cards.length} cards from page ${page}`);

    let totalInserted = 0;

    for (const card of cards) {
      await sql`
        INSERT INTO cards (set_id, details)
        VALUES (${card.set.id}, ${JSON.stringify(card)}::jsonb)
      `;
      totalInserted++;
    }

    return NextResponse.json({
      success: true,
      page,
      pageSize,
      totalInserted,
      date: formattedDate,
    });
  } catch (error) {
    console.error("Error updating cards:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
