import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Report from "@/models/Report";
import cloudinary from "@/config/cloudinary";

// Configure Cloudinary directly here

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const id = formData.get("id");
    const file = formData.get("proofImage");

    if (!id || !file) {
      return NextResponse.json(
        { success: false, message: "Missing report ID or proof image" },
        { status: 400 }
      );
    }

    // Upload proof image to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "cleaner_proofs" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Update report: append proof image and change status
    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    report.status = "Resolved";
    report.images.push({ filename: file.name, url: uploadRes.secure_url });

    await report.save();

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
