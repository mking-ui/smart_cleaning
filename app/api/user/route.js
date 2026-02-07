// /app/api/users/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("name email phone role");
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
