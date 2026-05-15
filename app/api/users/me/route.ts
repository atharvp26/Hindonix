import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import pool from "@/lib/db";

/** GET /api/users/me
 * Returns the current user's DB record (auto-creates on first call).
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if user exists
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE clerk_id = ?",
      [userId]
    );
    const existing = (rows as any[])[0];
    if (existing) {
      // Update last_login
      await pool.query(
        "UPDATE users SET last_login = NOW() WHERE clerk_id = ?",
        [userId]
      );
      return NextResponse.json(existing);
    }

    // Auto-create on first visit
    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
    const name =
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
      email;

    await pool.query(
      `INSERT INTO users (clerk_id, email, name, role)
       VALUES (?, ?, ?, 'user')
       ON DUPLICATE KEY UPDATE last_login = NOW()`,
      [userId, email, name]
    );

    const [newRows] = await pool.query(
      "SELECT * FROM users WHERE clerk_id = ?",
      [userId]
    );
    return NextResponse.json((newRows as any[])[0]);
  } catch (err: any) {
    console.error("Error in /api/users/me:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}
