export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAdmin } from "@/app/lib/admin-auth";
import { connectToDatabase } from "../../lib/db/models";

const ROLES = ["admin", "super_admin"];

/**
 * POST /api/admin/create-admin
 * headers: Authorization: Bearer <token from /api/admin/login> (must be a super_admin)
 * body: { email, password, name?, role? }  role defaults to "admin"
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (admin.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Only a super_admin can create admins" },
        { status: 403 }
      );
    }

    const { email, password, name, role = "admin" } = await req.json();
    const cleanEmail = String(email ?? "")
      .trim()
      .toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    if (!ROLES.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Role must be one of: ${ROLES.join(", ")}` },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const col = db.collection("admin_users");

    if (await col.findOne({ email: cleanEmail })) {
      return NextResponse.json(
        { success: false, error: "An admin with this email already exists" },
        { status: 409 }
      );
    }

    const result = await col.insertOne({
      email: cleanEmail,
      password: await bcrypt.hash(password, 10),
      name: String(name ?? "").trim() || "Admin User",
      role,
      createdAt: new Date(),
      createdBy: admin.email,
    });

    return NextResponse.json({
      success: true,
      admin: { id: result.insertedId.toString(), email: cleanEmail, role },
    });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
