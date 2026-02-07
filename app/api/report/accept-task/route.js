import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { reportId, cleanerId } = await req.json();

    if (!reportId || !cleanerId) {
      return NextResponse.json(
        { success: false, message: "Missing report ID or cleaner ID" },
        { status: 400 }
      );
    }

    // ✅ Verify the cleaner exists
    const cleaner = await User.findById(cleanerId).select("firstName surname email");
    if (!cleaner) {
      return NextResponse.json(
        { success: false, message: "Cleaner not found" },
        { status: 404 }
      );
    }

    // ✅ Verify the report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    // ✅ Update report fields
    report.status = "In Progress";
    report.assignedCleaner = cleaner._id; // now using ObjectId (consistent with your model)
    await report.save();

    // ✅ Populate the assigned cleaner details before sending response
    const updatedReport = await Report.findById(report._id).populate(
      "assignedCleaner",
      "firstName surname email"
    );

    return NextResponse.json({
      success: true,
      message: "Task accepted and moved to In Progress",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error accepting task:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
