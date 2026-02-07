"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Loading from "@/components/Loading";

const SupervisorDashboard = () => {
  const [reportSummary, setReportSummary] = useState([]);
  const [weeklyJobs, setWeeklyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/report/summary");
      const data = await res.json();

      if (data.success) {
        setReportSummary(data.summary);
        setWeeklyJobs(data.weeklyJobs);

        // ✅ Save to localStorage
        localStorage.setItem("summary", JSON.stringify(data.summary));
        localStorage.setItem("weeklyJobs", JSON.stringify(data.weeklyJobs));
      }
    } catch (err) {
      console.warn("Error fetching dashboard data:", err.message);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  try {
    const cachedSummary = localStorage.getItem("summary");
    const cachedWeekly = localStorage.getItem("weeklyJobs");

    if (cachedSummary && cachedSummary !== "undefined") {
      setReportSummary(JSON.parse(cachedSummary));
    }
    if (cachedWeekly && cachedWeekly !== "undefined") {
      setWeeklyJobs(JSON.parse(cachedWeekly));
    }
  } catch (err) {
    console.warn("Error reading cache:", err.message);
    // Clear invalid data if parse fails
    localStorage.removeItem("summary");
    localStorage.removeItem("weeklyJobs");
  }

  setLoading(false);
  fetchDashboardData();

  // ✅ Auto-refresh every 15 seconds
  const interval = setInterval(fetchDashboardData, 15000);
  return () => clearInterval(interval);
}, []);


  return (
    <div className="p-4 sm:p-6 space-y-8 w-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Dashboard Header */}
          <h2 className="text-lg sm:text-xl font-bold text-emerald-900">
            Supervisor Dashboard
          </h2>

          {/* Summary Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  {reportSummary.map((item) => (
    <div
      key={item.name}
      className="p-4 sm:p-5 bg-white rounded-xl shadow-sm border flex flex-col items-center justify-center"
    >
      <p className="text-gray-500 text-sm sm:text-base font-medium text-center">
        {item.name}
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-emerald-800 text-center">
        {item.value}
      </p>
    </div>
  ))}
</div>


          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Pie Chart */}
            <div className="col-span-6 bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Reports Status
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={reportSummary}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {reportSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="col-span-6 bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Jobs This Week
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyJobs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jobs" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        
        </>
      )}
    </div>
  );
};

export default SupervisorDashboard;
