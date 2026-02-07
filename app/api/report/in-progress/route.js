import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    // ✅ Connect to the database
    await connectDB();

    // ✅ Fetch all reports with status "In Progress"
    const reports = await Report.find({ status: "In Progress" })
      .populate("assignedCleaner", "firstName surname email")
      .sort({ createdAt: -1 });

    // ✅ Return successful response
    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Error fetching in-progress reports:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch in-progress reports",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
