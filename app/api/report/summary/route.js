import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();

    // Fetch reports by correct statuses
    const [pending, inProgress, resolved, approved, completed] = await Promise.all([
      Report.find({ status: "Pending" }).lean(),
      Report.find({ status: "In Progress" }).lean(),
      Report.find({ status: "Resolved" }).lean(),
      Report.find({ status: "Approved" }).lean(),
      Report.find({ status: "Completed" }).lean(),
    ]);

    // ✅ Summary for Pie Chart
    const summary = [
      { name: "Pending", value: pending.length, color: "#facc15" },
      { name: "In Progress", value: inProgress.length, color: "#3b82f6" },
      { name: "Completed", value: resolved.length, color: "#16a34a" },
      { name: "Approved", value: approved.length, color: "#0ea5e9" },
    ];

    // ✅ Weekly Jobs for Bar Chart
    const allReports = [...pending, ...inProgress, ...resolved, ...approved];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyJobs = days.map((day, index) => ({
      day,
      jobs: allReports.filter(
        (r) => new Date(r.createdAt).getDay() === index
      ).length,
    }));

    return NextResponse.json({
      success: true,
      summary,
      weeklyJobs,
    });
  } catch (error) {
    console.error("Error fetching report summary:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load summary" },
      { status: 500 }
    );
  }
}
