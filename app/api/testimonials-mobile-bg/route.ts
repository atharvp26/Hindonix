import { NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials_mobile_bg (
      id  INT AUTO_INCREMENT PRIMARY KEY,
      url VARCHAR(1000) NOT NULL DEFAULT ''
    )
  `);
}

export async function GET() {
  try {
    await ensureTable();
    const [rows] = await pool.query("SELECT url FROM testimonials_mobile_bg ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    return NextResponse.json({ url: r?.url || "" });
  } catch {
    return NextResponse.json({ url: "" });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTable();
    const { url } = await request.json() as { url: string };
    const [rows] = await pool.query("SELECT id FROM testimonials_mobile_bg LIMIT 1");
    const existing = (rows as any[])[0];
    if (existing) {
      await pool.query("UPDATE testimonials_mobile_bg SET url=? WHERE id=?", [url, existing.id]);
    } else {
      await pool.query("INSERT INTO testimonials_mobile_bg (url) VALUES (?)", [url]);
    }
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[testimonials-mobile-bg PUT]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
