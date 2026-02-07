import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();

    // ✅ Fetch all reports that have been assigned to cleaners
    const assignedReports = await Report.find({
      assignedCleaner: { $exists: true, $ne: null },
      status: { $in: ["Approved", "In Progress", "Resolved", "Completed"] }, // adjust statuses as needed
    })
      .populate("assignedCleaner", "firstName surname email")
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      count: assignedReports.length,
      reports: assignedReports,
    });
  } catch (error) {
    console.error("Error fetching assigned reports:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch assigned reports" },
      { status: 500 }
    );
  }
}
