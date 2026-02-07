export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/config/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions = {
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

        // 🔹 Validate fields first
        if (!username || !password || !role) {
          throw new Error("Please fill in all required fields");
        }

        // 🔹 Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error("Username not found");
        }

        // 🔹 Check role match
        if (user.role !== role) {
          throw new Error("User role not matching");
        }

        // 🔹 Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect password");
        }

        // ✅ Return user details if all checks pass
        return {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
          email: user.email,
          firstName: user.firstName,
          surname: user.surname,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.firstName = user.firstName;
        token.surname = user.surname;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.surname = token.surname;
      return session;
    },
  },

  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
