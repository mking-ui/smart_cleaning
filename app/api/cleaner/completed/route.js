import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Cleaner email is required" },
        { status: 400 }
      );
    }

    // ✅ Find the cleaner by email
    const cleaner = await User.findOne({ email });

    if (!cleaner) {
      return NextResponse.json(
        { success: false, message: "Cleaner not found" },
        { status: 404 }
      );
    }

    // ✅ Fetch all supervisor-approved (Completed) reports assigned to this cleaner
    const reports = await Report.find({
      assignedCleaner: cleaner._id,
      status: "Completed",   // 👈 only completed tasks
    })
      .populate("assignedCleaner", "firstName surname email")
      .sort({ updatedAt: -1 });


    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching completed reports:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch completed reports" },
      { status: 500 }
    );
  }
}
