import connectDB from "@/config/db";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const pendingReports = await Report.find({ status: "Pending" }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reports: pendingReports });
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
