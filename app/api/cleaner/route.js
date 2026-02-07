import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Return cleaners with unified name field (firstName + surname)
    const cleaners = await User.find({ role: "Cleaner" })
      .select("firstName surname email phone role")
      .lean();

    const normalized = cleaners.map(u => ({
      _id: u._id,
      name: `${u.firstName || ""} ${u.surname || ""}`.trim(),
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "Cleaner"
    }));

    return NextResponse.json({ success: true, cleaners: normalized });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load cleaners" },
      { status: 500 }
    );
  }
}
