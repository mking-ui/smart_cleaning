// /app/api/supervisor/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();

    // You can replace this with actual auth logic later
    const supervisor = await User.findOne({ role: "Supervisor" }).select("fullName username email phone profilePic");

    if (!supervisor) {
      return NextResponse.json({ success: false, message: "Supervisor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, supervisor });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
