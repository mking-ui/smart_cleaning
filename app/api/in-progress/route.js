import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const cleanerEmail = searchParams.get("email");

    if (!cleanerEmail) {
      return NextResponse.json(
        { success: false, message: "Cleaner email is required" },
        { status: 400 }
      );
    }

    // ✅ Find the cleaner by email
    const cleaner = await User.findOne({ email: cleanerEmail });
    if (!cleaner) {
      return NextResponse.json(
        { success: false, message: "Cleaner not found" },
        { status: 404 }
      );
    }

    // ✅ Find all reports assigned to this cleaner in progress
    const reports = await Report.find({
      assignedCleaner: cleaner._id,
      status: "In Progress",
    })
      .populate("assignedCleaner", "firstName surname email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Error fetching in-progress reports:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reports", error: error.message },
      { status: 500 }
    );
  }
}
