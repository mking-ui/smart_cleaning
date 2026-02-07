import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col  bg-emerald-900/80 border-t md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-gray-300 text-slate-100">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-4 text-sm">
          Web Based Cleaning Management System
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-yellow-400 mb-2">Cleaning Management</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link className="hover:underline transition" href="/report">Reporter</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="/supervisor">Supervisor</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="/cleaner">Cleaner</Link>
              </li>
             
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-yellow-400 mb-2">Dev. Info</h2>
            <div className="text-sm space-y-2">
              <p>+234 907 676 1102</p>
              <p>contact@mic-jade.vercel.app</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-muted bg-yellow-400 text-xs md:text-sm">
        Copyright 2025 © mic empire.
      </p>
    </footer>
  );
};

export default Footer;