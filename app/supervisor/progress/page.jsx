"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Loading from "@/components/Loading";
import Footer from "@/components/supervisor/Footer";
import { useSession } from "next-auth/react";

const ProgressReports = () => {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch reports with "In Progress" status (for supervisor only)
  const fetchReports = async () => {
    try {
      const res = await fetch("/api/report/in-progress", {
        method: "GET",
        credentials: "include", // important for session cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch reports:", data.message);
        return;
      }

      setReports(data.reports || []);
       localStorage.setItem("reports", JSON.stringify(data.reports));
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      const cached = localStorage.getItem("reports");
      if (cached) {
        setReports(JSON.parse(cached));
        setLoading(false);
      }
      fetchReports(); // Always refresh in the background
      const interval = setInterval(fetchReports, 10000); // auto-refresh
      return () => clearInterval(interval);
    }, [status]);

   return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading?(
        <Loading/>
      ):(<div className="md:p-10 p-4">
        <h2 className="text-lg font-bold text-emerald-900 mb-6">
          In-Progress Cleaning Tasks
        </h2>

        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report._id}
                className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4"
              >
                {/* Task Details */}
                <div>
                  <p className="font-semibold text-emerald-900">
                    {report.jobType || "Untitled Task"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cleaner:{" "}
                    {report.assignedCleaner
                      ? `${report.assignedCleaner.firstName} ${report.assignedCleaner.surname}`
                      : "Unassigned"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {report.location || "Not specified"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Deadline:{" "}
                    {report.deadline
                      ? new Date(report.deadline).toLocaleDateString("en-GB")
                      : "No deadline"}
                  </p>
                  <p className="text-xs font-semibold mt-1 px-2 py-1 rounded w-fit bg-blue-100 text-blue-700">
                    {report.status}
                  </p>
                </div>

                {/* Task Image */}
                <div className="w-full md:w-32 h-24 flex-shrink-0">
                  <Image
                    src={report.images?.[0]?.url || assets.upload_area}
                    alt={report.jobType || "Task image"}
                    width={128}
                    height={96}
                    className="w-full h-full object-cover rounded-md border"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No in-progress reports found.</p>
          )}
        </div>
      </div>)}
      

      <Footer />
    </div>
  );
};

export default ProgressReports;
