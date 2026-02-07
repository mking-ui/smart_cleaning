"use client";

import React from "react";
import Image from "next/image";
import { assets } from "../../assets/assets";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/", // where to send user after logout
    });
  };
  const role = session?.user?.role;

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b bg-emerald-800 text-white">
      <Image
        onClick={() => router.push("/")}
        className="w-28 lg:w-32 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      <button className="text-yellow-400 font-medium px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
        {role || "User"}
      </button>

      <button
        onClick={handleLogout}
        className="bg-yellow-400 text-emerald-800 px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        {status === "loading" ? "Loading..." : "Logout"}
      </button>
    </div>
  );
};

export default Navbar;
