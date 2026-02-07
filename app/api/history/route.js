import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/config/db";
import User from "@/models/User";
import Report from "@/models/Report";
import bcrypt from "bcrypt";

// ✅ Define inline authOptions (same as in your [...nextauth] route)
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        await connectDB();
        const { username, password, role } = credentials;

        const user = await User.findOne({ username });
        if (!user) throw new Error("User not found");
        if (user.role !== role) throw new Error("Invalid role");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          surname: user.surname,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ GET: Fetch only logged-in user’s reports
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();

    // ✅ Fetch reports created by this specific user
    const reports = await Report.find({
      reporterEmail: session.user.email,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
