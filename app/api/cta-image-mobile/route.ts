import { NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cta_image_mobile (
      id  INT AUTO_INCREMENT PRIMARY KEY,
      url VARCHAR(1000) NOT NULL DEFAULT ''
    )
  `);
}

export async function GET() {
  try {
    await ensureTable();
    const [rows] = await pool.query("SELECT url FROM cta_image_mobile ORDER BY id ASC LIMIT 1");
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
    const [rows] = await pool.query("SELECT id FROM cta_image_mobile LIMIT 1");
    const existing = (rows as any[])[0];
    if (existing) {
      await pool.query("UPDATE cta_image_mobile SET url=? WHERE id=?", [url, existing.id]);
    } else {
      await pool.query("INSERT INTO cta_image_mobile (url) VALUES (?)", [url]);
    }
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[cta-image-mobile PUT]", err);
    return NextResponse.json({ error: "Failed to save mobile CTA image" }, { status: 500 });
  }
}
