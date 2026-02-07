import connectDB from "@/config/db";
import Report from "@/models/Report";
import User from "@/models/User"; // ✅ cleaners live here
import { NextResponse } from "next/server";
import { sendMail } from "@/config/mail";

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { reportId, minutes } = body;

    if (!reportId) {
      return NextResponse.json(
        { success: false, message: "Missing report ID" },
        { status: 400 }
      );
    }

    // Default deadline if minutes not provided
    const deadlineDate = new Date();
    deadlineDate.setMinutes(deadlineDate.getMinutes() + Number(minutes || 30));

    // 🔍 Get all cleaners
    const cleaners = await User.find({ role: "Cleaner" })
      .select("firstName surname email")
      .lean();

    if (!cleaners.length) {
      return NextResponse.json(
        { success: false, message: "No cleaners available" },
        { status: 404 }
      );
    }

    // 📊 Find cleaner with least workload
    let chosenCleaner = null;
    let minTasks = Infinity;

    for (const cleaner of cleaners) {
      const taskCount = await Report.countDocuments({
        assignedCleaner: cleaner._id,
        status: { $in: ["Approved", "In Progress"] }
      });
      if (taskCount < minTasks) {
        minTasks = taskCount;
        chosenCleaner = cleaner;
      }
    }

    // 📝 Update report: approve + assign cleaner
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        status: "Approved",
        assignedCleaner: chosenCleaner._id,
        deadline: deadlineDate,
      },
      { new: true }
    ).populate("assignedCleaner", "firstName surname email");

    if (!updatedReport) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    // 📧 Notify cleaner
    if (updatedReport.assignedCleaner?.email) {
      try {
        await sendMail({
          to: updatedReport.assignedCleaner.email,
          subject: "New Task Assigned - SmartCleaning System",
          html: `
            <h2>Hello ${updatedReport.assignedCleaner.firstName} ${updatedReport.assignedCleaner.surname},</h2>
            <p>You have been assigned a new cleaning task.</p>
            <p><strong>Job Type:</strong> ${updatedReport.jobType}</p>
            <p><strong>Location:</strong> ${updatedReport.location}</p>
            <p><strong>Description:</strong> ${updatedReport.description}</p>
            <p><strong>Urgency:</strong> ${updatedReport.urgency}</p>
            <p><strong>Deadline:</strong> ${deadlineDate.toLocaleString()}</p>
            <br />
            <p>Please log in to your dashboard to view full details.</p>
            <p>Regards,<br/><strong>SmartCleaning Supervisor Team</strong></p>
          `,
        });
        console.log(
          `✅ Task ${updatedReport._id} auto-assigned to ${updatedReport.assignedCleaner.firstName} ${updatedReport.assignedCleaner.surname} (${updatedReport.assignedCleaner.email})`
        );
      } catch (emailError) {
        console.error("⚠️ Failed to send email:", emailError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Task approved and auto-assigned to ${updatedReport.assignedCleaner.firstName} ${updatedReport.assignedCleaner.surname}.`,
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error approving and assigning report:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
