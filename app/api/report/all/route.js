// /app/api/report/all/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();

    // ✅ Only fetch approved reports
    const reports = await Report.find({ status: "Resolved" });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching approved reports:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
