"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const RegisterCleaner = () => {
  const [role, setRole] = useState("Cleaner");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();


  const handleSubmit = (e) => {
    setIsSubmiting(true)
    e.preventDefault();
    if (!agree) {
      alert("You must agree before registering.");
      return;
    }
    setShowConfirm(true);

    setIsSubmiting(false)

  };

  const handleConfirm = async () => {
    setShowConfirm(false);


    try {
      if (password !== verifyPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role,
          firstName,
          surname,
          email,
          phone,
          username,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Registration successful!");
      router.replace("/supervisor")


    } catch (error) {
      toast.error("Error: " + error.message);
    }

  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-800 overflow-y-auto">
      <div className="bg-white  rounded-xl shadow-xl w-full max-w-md sm:max-w-lg p-6 relative my-8 mx-4 h-auto max-h-[90vh] overflow-y-auto">
        {/* Close button */}


        <h2 className="text-2xl font-bold text-emerald-900 text-center mb-6">
          Register Account
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
             
            </select>
          </div>

          {/* First Name / Surname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">First Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-medium">Surname</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium">Phone</label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
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

          {/* Password / Verify */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="font-medium">Verify Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              id="agree"
            />
            <label htmlFor="agree" className="text-sm">
              Confirm
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-emerald-900 font-semibold py-2 rounded hover:opacity-90 transition"
            disabled={isSubmiting}
          >
            {isSubmiting ? "Please wait ...." : "Register"}
          </button>
          <div className="mt-4 space-y-2 text-center">
            <Link
              href="/login"
              className="block w-full text-emerald-800 border border-emerald-800 py-2 rounded hover:bg-emerald-800 hover:text-white transition"
            >
              Already have an account? Login
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

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center my-8 mx-6">
            <h3 className="text-lg font-bold mb-4 text-emerald-900">
              Confirm Registration
            </h3>
            <p className="mb-6">
              Are you sure you want to create this account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-yellow-400 text-emerald-900 rounded font-semibold"

              >
                Yes, Register
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-2 border border-gray-400 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterCleaner;
