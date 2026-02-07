import connectDB from "@/config/db";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const report = await Report.findById("6933474f9855dfca9053426e")
    .populate("assignedCleaner", "firstName surname email");
  return NextResponse.json({ report });
}
