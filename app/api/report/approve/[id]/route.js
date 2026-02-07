import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const report = await Report.findByIdAndUpdate(
      id,
      { status: "Completed" },
      { new: true }
    );

    if (!report) {
      return NextResponse.json({ message: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task approved successfully", report });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { message: "Failed to approve task" },
      { status: 500 }
    );
  }
}
