"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import Image from "next/image";// ✅ 
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <>
      <nav className="flex items-center bg-emerald-900/80 justify-between px-4 md:px-16 lg:px-32 py-3 shadow-slate-300  text-gray-200">
        <Image
          className="cursor-pointer w-28 md:w-40"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="logo"
        />

        <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link href="/" className="hover:text-yellow-400 transition">
            Home
          </Link>

          <Link href="/" className="hover:text-yellow-400 transition">
            About Us
          </Link>
          <Link href="/" className="hover:text-yellow-400 transition">
            Contact
          </Link>


        </div>

        <ul className="hidden md:flex items-center gap-4">
      
          <Link href="/register"      
            className="flex items-center gap-2  font-normal hover:bg-slate-100  text-emerald-900/80 bg-yellow-500 rounded-full px-2 p-1  transition"
          >
            <Image src={assets.add} alt="user icon"  />
            Register
          </Link>
          <Link
           href="/login"
            className="flex items-center gap-2 hover:text-yellow-400 transition px-2 p-1 text-slate-100"
          >
            <Image src={assets.key} alt="user icon" className=" hover:text-yellow-400 "   />
            Login
          </Link>
        </ul>

        <div className="flex items-center md:hidden gap-2">

          <Link
          href="/register"
           
            className="flex items-center gap-2 hover:bg-slate-100  text-emerald-900/80 bg-yellow-500 rounded-full px-2 p-2 transition"
          >
            <Image src={assets.user_icon} alt="user icon" 
 />
            Register
          </Link>
          <Link
           href="/login"
            className="flex items-center gap-2 hover:text-yellow-400 px-2 p-2 transition"
          >
            <Image src={assets.user_icon} alt="user icon"  />
            Login
          </Link>
        </div>
      </nav>

     
    </>
  );
};

export default Navbar;
