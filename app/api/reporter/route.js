import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();

    // Aggregate distinct reporters by email and include phone/role from users if available
    const reporters = await Report.aggregate([
      {
        $group: {
          _id: "$reporterEmail",
          name: { $first: "$reporterName" },
          email: { $first: "$reporterEmail" },
          phoneFromReport: { $first: "$reporterPhone" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "userInfo"
        }
      },
      {
        $addFields: {
          phoneFromUser: { $first: "$userInfo.phone" },
          roleFromUser: { $first: "$userInfo.role" }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          phone: { $ifNull: ["$phoneFromUser", "$phoneFromReport", ""] },
          role: { $ifNull: ["$roleFromUser", "Reporter"] }
        }
      }
    ]);

    return NextResponse.json({ success: true, reporters });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load reporters" },
      { status: 500 }
    );
  }
}
