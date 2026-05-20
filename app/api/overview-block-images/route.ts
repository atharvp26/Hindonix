import { NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS overview_block_images (
      id   INT AUTO_INCREMENT PRIMARY KEY,
      urls VARCHAR(5000) NOT NULL DEFAULT '[]'
    )
  `);
}

export async function GET() {
  try {
    await ensureTable();
    const [rows] = await pool.query("SELECT urls FROM overview_block_images ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    if (!r) return NextResponse.json([]);
    const urls = typeof r.urls === "string" ? JSON.parse(r.urls) : r.urls;
    return NextResponse.json(Array.isArray(urls) ? urls : []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTable();
    const urls = await request.json() as string[];
    const [rows] = await pool.query("SELECT id FROM overview_block_images LIMIT 1");
    const existing = (rows as any[])[0];
    if (existing) {
      await pool.query("UPDATE overview_block_images SET urls=? WHERE id=?", [JSON.stringify(urls), existing.id]);
    } else {
      await pool.query("INSERT INTO overview_block_images (urls) VALUES (?)", [JSON.stringify(urls)]);
    }
    return NextResponse.json(urls);
  } catch (err) {
    console.error("[overview-block-images PUT]", err);
    return NextResponse.json({ error: "Failed to save overview block images" }, { status: 500 });
  }
}
