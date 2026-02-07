"use client";
import { signIn, useSession } from "next-auth/react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import Link from "next/link";

const LoginFormPage = () => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState("Reporter");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState(false);


 

  const handleSubmit = async (e) => {
    setIsSubmiting(true);
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        role,
      });


      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
         // ✅ Redirect immediately based on role (no session waiting)
      if (role === "Supervisor") router.replace("/supervisor");
      else if (role === "Cleaner") router.replace("/cleaner");
      else router.replace("/report");
        
      }


    } catch (error) {
      toast.error("Error: " + error.message);

    }
    finally {
      setIsSubmiting(false)
    }


  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-800 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg p-6 relative my-8 mx-4 h-auto max-h-[90vh] overflow-y-auto">
        {/* Close button */}


        <h2 className="text-2xl font-bold text-emerald-900 text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div className="flex flex-col">
            <label className="font-medium">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="Supervisor">Supervisor</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Reporter">Reporter</option>
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="font-medium">Username</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-emerald-900 font-semibold py-2 rounded hover:opacity-90 transition"
            disabled={isSubmiting}
          >
            {isSubmiting ? "Please wait ...." : "Login"}
          </button>
          <div className="mt-4 space-y-2 text-center">
            <Link
              href="/register"
              className="block w-full text-emerald-800 border border-emerald-800 py-2 rounded hover:bg-emerald-800 hover:text-white transition"
            >
              Don’t have an account? Register
            </Link>

            <Link
              href="/"
              className="block text-emerald-700 hover:underline transition"
            >
              Back to Home
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginFormPage;
