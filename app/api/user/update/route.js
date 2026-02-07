import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/config/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function PUT(req) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, surname, email, phone, username, currentPassword, newPassword } =
      await req.json();

    const user = await User.findById(token.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      if (newPassword && newPassword.trim().length >= 6) {
        user.password = await bcrypt.hash(newPassword, 10);
      } else if (newPassword) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }
    }

    user.firstName = firstName || user.firstName;
    user.surname = surname || user.surname;
    user.phone = phone || user.phone;
    user.username = username || user.username;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "An error occurred while updating profile" },
      { status: 500 }
    );
  }
}
