import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// Helper: retry logic with exponential backoff
async function fetchWithRetry(url, options = {}, retries = 5, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        // Retry only on 5xx errors
        if (response.status >= 500 && response.status < 600) {
          console.warn(
            `Attempt ${attempt} failed (${response.status}). Retrying in ${delay}ms...`
          );
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2; // exponential backoff
          continue;
        } else {
          throw new Error(`Pokémon API error: ${response.status}`);
        }
      }

      return await response.json(); // success
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(
        `Fetch attempt ${attempt} failed with ${err.message}. Retrying in ${delay}ms...`
      );
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }

  throw new Error(`Failed to fetch after ${retries} attempts`);
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const pageSize = 250;

    let formattedDate = searchParams.get("date");
    if (!formattedDate) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      formattedDate = `${yyyy}/${mm}/${dd}`;
    }

    console.log(`Fetching cards for ${formattedDate}, page ${page}`);

    const url = `https://api.pokemontcg.io/v2/cards?q=set.updatedAt:"${formattedDate}"&page=${page}&pageSize=${pageSize}`;

    // Use the retrying fetch helper
    const data = await fetchWithRetry(url, {
      headers: { "X-Api-Key": process.env.POKEMON_TCG_API_KEY },
      cache: "no-store",
    });

    const cards = data?.data || [];
    console.log(`Inserting ${cards.length} cards from page ${page}`);

    let totalInserted = 0;

    // Example DB insert (commented out)
    // for (const card of cards) {
    //   await sql`
    //     INSERT INTO cards (set_id, details)
    //     VALUES (${card.set.id}, ${JSON.stringify(card)}::jsonb)
    //   `;
    //   totalInserted++;
    // }

    return NextResponse.json({
      success: true,
      page,
      pageSize,
      totalInserted,
      date: formattedDate,
      cards,
    });
  } catch (error) {
    console.error("Error updating cards:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
