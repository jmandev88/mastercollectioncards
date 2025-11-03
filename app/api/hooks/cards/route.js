import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import cards from "../../../data/base1/base1.json";

const sql = neon(
  "postgresql://neondb_owner:npg_8eHU7FbVTpvD@ep-rapid-pond-ahorbczd-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
);

export async function GET() {
  const sets = cards;

  for (const set of sets) {
    // Normalize date from "YYYY/MM/DD HH:mm:ss" → "YYYY-MM-DD"
    const updatedDate = set.updatedAt?.split(" ")[0]?.replace(/\//g, "-");
    // Only insert/update if the date matches today
    // const result = await sql`
    //       INSERT INTO cards (set_id, details)
    //       VALUES (${set.set.id}, ${JSON.stringify(set)}::jsonb)
    //       RETURNING id;
    //     `;
    //   // inserted.push(result[0]?.id || null);
  }

  return NextResponse.json({
    success: sets,
  });
}
