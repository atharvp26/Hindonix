import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const [rows] = await pool.query(
    "SELECT role FROM users WHERE clerk_id = ?",
    [userId]
  );
  const user = (rows as any[])[0];
  return user?.role === "admin" ? userId : null;
}

/** GET /api/users — list all users (admin only) */
export async function GET() {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, clerk_id, email, name, role, created_at, last_login FROM users ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/** PATCH /api/users — update a user's role (admin only) */
export async function PATCH(request: Request) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { clerk_id, role } = await request.json();
    if (!clerk_id || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    // Prevent admin from removing their own admin role
    if (clerk_id === adminId && role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role" },
        { status: 400 }
      );
    }
    await pool.query("UPDATE users SET role = ? WHERE clerk_id = ?", [
      role,
      clerk_id,
    ]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update role" },
      { status: 500 }
    );
  }
}
