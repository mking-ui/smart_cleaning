import { sendMail } from "@/config/mail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sendMail({ to, subject, html });

    if (result.success) {
      return NextResponse.json({ message: "Email sent successfully" });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
