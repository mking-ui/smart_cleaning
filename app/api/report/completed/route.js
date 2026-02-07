import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();

    const completedReports = await Report?.find({
      status: { $in: ["Resolved", "Completed", "Approved"] },
    })
      .populate("assignedCleaner", "firstName surname email")
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      count: completedReports.length,
      reports: completedReports,
    });
  } catch (error) {
    console.error("Error fetching completed reports:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch completed reports" },
      { status: 500 }
    );
  }
}
