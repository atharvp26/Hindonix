import { NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials_mobile_bg (
      id   INT AUTO_INCREMENT PRIMARY KEY,
      urls JSON NOT NULL DEFAULT ('[]')
    )
  `);
}

function parseJSON(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

export async function GET() {
  try {
    await ensureTable();
    const [rows] = await pool.query("SELECT urls FROM testimonials_mobile_bg ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    return NextResponse.json(parseJSON(r?.urls));
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTable();
    const { urls } = await request.json() as { urls: string[] };
    const [rows] = await pool.query("SELECT id FROM testimonials_mobile_bg LIMIT 1");
    const existing = (rows as any[])[0];
    if (existing) {
      await pool.query("UPDATE testimonials_mobile_bg SET urls=? WHERE id=?", [JSON.stringify(urls), existing.id]);
    } else {
      await pool.query("INSERT INTO testimonials_mobile_bg (urls) VALUES (?)", [JSON.stringify(urls)]);
    }
    return NextResponse.json(urls);
  } catch (err) {
    console.error("[testimonials-mobile-bg PUT]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
