"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Loading from "@/components/Loading";

const SupervisorProfile = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);



  const fetchSupervisor = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/supervisor");
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    // ✅ Save fetched data to state and cache
    setSupervisor(data.supervisor || []);
    localStorage.setItem("supervisorData", JSON.stringify(data.supervisor || []));
  } catch (error) {
    console.warn("Error fetching supervisor data:", error.message);
    setError("Something went wrong while loading data");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // 1️⃣ Load from localStorage first (if available)
  const cached = localStorage.getItem("supervisorData");
  if (cached) {
    try {
      setSupervisor(JSON.parse(cached));
      setLoading(false);
    } catch (err) {
      console.warn("Invalid cached supervisor data:", err);
    }
  }

  // 2️⃣ Then fetch fresh data
  fetchSupervisor();
}, []);



  return (
    <div className="flex-1 min-h-screen bg-slate-100 p-6 md:p-10">
      {loading?(
        <Loading/>
      ): ( <div className="bg-white shadow-xl max-w-md mx-auto rounded-lg overflow-hidden">
        {/* Profile Picture */}
        <div className="flex flex-col items-center p-6 bg-emerald-900 text-white">
          <Image
            src={supervisor?.profilePic || assets.user_icon}
            alt="Supervisor"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
          />
          <h2 className="mt-3 text-xl font-bold">{supervisor?.fullName}</h2>
          <p className="text-yellow-300 text-sm">Supervisor</p>
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Username</p>
            <p className="font-semibold">{supervisor?.username}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-semibold">{supervisor?.email}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-semibold">{supervisor?.phone}</p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-gray-50 text-center">
          <button className="bg-yellow-400 text-emerald-900 px-6 py-2 rounded font-semibold hover:opacity-90 transition">
            Manage Reports
          </button>
        </div>
      </div>)}
     
    </div>
  );
};

export default SupervisorProfile;
