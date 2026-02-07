import connectDB from "@/config/db";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const approvedReports = await Report.find({ status: "Completed" }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reports: approvedReports });
  } catch (error) {
    console.error("Error fetching approved reports:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
