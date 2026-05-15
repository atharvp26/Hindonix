import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM inquiries ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("Error fetching inquiries:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, email, phone, company, country, city,
      product, subject, message, submissionId,
    } = body;

    const [result] = await pool.query(
      `INSERT INTO inquiries (name, email, phone, company, country, city, product, subject, message, submission_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, email, phone,
        company ?? null, country, city,
        product ?? null, subject ?? null,
        message, submissionId ?? null,
      ]
    );

    const id = (result as any).insertId;
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err: any) {
    console.error("Error saving inquiry:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save inquiry" },
      { status: 500 }
    );
  }
}
