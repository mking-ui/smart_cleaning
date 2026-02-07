import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // 👈 import config
import connectDB from "@/config/db";
import Report from "@/models/Report";
import cloudinary from "@/config/cloudinary";

export async function POST(request) {
  try {
    await connectDB();

    // ✅ Get session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, email, firstName, surname } = session.user;

    // ✅ Parse form data
    const formData = await request.formData();
    const location = formData.get("location");
    const description = formData.get("description");
    const urgency = formData.get("urgency");
    const jobType = formData.get("jobType");
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No images uploaded" }, { status: 400 });
    }

    // ✅ Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${buffer.toString("base64")}`,
          { resource_type: "image" }
        );
        return { filename: result.original_filename, url: result.secure_url };
      })
    );

    // ✅ Save report to DB
    const newReport = await Report.create({
      userId: id,
      firstName,
      surname,
      reporterEmail: email,
      location,
      description,
      urgency,
      jobType,
      images: uploadedImages,
      status: "Pending",
    });

    return NextResponse.json({ success: true, message: "Report submitted", report: newReport });
  } catch (error) {
    console.error("Error in /api/report:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
