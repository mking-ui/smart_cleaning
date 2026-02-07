"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [selectedCleaner, setSelectedCleaner] = useState("");
  const [selectedMinutes, setSelectedMinutes] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const minutesOptions = [20, 30, 40, 50];

  useEffect(() => {
    fetchApprovedReports();
    fetchCleaners();
  }, []);

  const fetchApprovedReports = async () => {
    try {
      const res = await fetch("/api/approved", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReports(data.reports);
    } catch (error) {
      console.error("Failed to fetch approved reports:", error.message);
    }
  };

  const fetchCleaners = async () => {
    try {
      const res = await fetch("/api/cleaner", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCleaners(data.cleaners);
    } catch (error) {
      console.error("Failed to fetch cleaners:", error.message);
    }
  };

  const handleAssign = async () => {
    setIsSubmiting(true);

    if (!selectedReportId || !selectedCleaner || !selectedMinutes) {
      toast.error("Please select report, cleaner and minutes.");
      setIsSubmiting(false);
      return;
    }

    try {
      const res = await fetch("/api/report/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: selectedReportId,
          cleanerId: selectedCleaner,
          minutes: Number(selectedMinutes),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Task successfully assigned!");
      setSelectedReportId("");
      setSelectedCleaner("");
      setSelectedMinutes("");
      fetchApprovedReports();
    } catch (error) {
      console.error("Assignment failed:", error.message);
      toast.error("Assignment failed: " + error.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  const selectedReport = reports.find((r) => r._id === selectedReportId);

  const getDeadlinePreview = () => {
    if (!selectedMinutes) return null;
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + Number(selectedMinutes));
    return deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-6">
        Assign Approved Tasks
      </h2>

      {/* Select Approved Report */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label className="block font-semibold text-gray-700 mb-2">
          Select Approved Report
        </label>
        <select
          value={selectedReportId}
          onChange={(e) => setSelectedReportId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Choose Report --</option>
          {reports.map((report) => (
            <option key={report._id} value={report._id}>
              {report.jobType} - {report.location}
            </option>
          ))}
        </select>
      </div>

      {/* Report Details */}
      {selectedReport && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-bold text-emerald-900 mb-2">Report Details</h3>
            <p><strong>Email:</strong> {selectedReport.reporterEmail}</p>
            <p><strong>Location:</strong> {selectedReport.location}</p>
            <p><strong>Description:</strong> {selectedReport.description}</p>
            <p><strong>Urgency:</strong> {selectedReport.urgency}</p>
            <p><strong>Job Type:</strong> {selectedReport.jobType}</p>
          </div>
          <div className="w-full md:w-48 h-32 flex-shrink-0">
            <img
              src={selectedReport.images?.[0]?.url || assets.clean}
              alt="Report"
              className="w-full h-full object-cover rounded-md border"
            />
          </div>
        </div>
      )}

      {/* Assign Task */}
      {selectedReport && (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">

          {/* Cleaner */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Assign Cleaner
            </label>
            <select
              value={selectedCleaner}
              onChange={(e) => setSelectedCleaner(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Choose Cleaner --</option>
              {cleaners.map((cleaner) => (
                <option key={cleaner._id} value={cleaner._id}>
                  {cleaner.name}
                </option>
              ))}
            </select>
          </div>

          {/* Minutes */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Select Duration (Minutes)
            </label>
            <select
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Minutes --</option>
              {minutesOptions.map((m) => (
                <option key={m} value={m}>
                  {m} minutes
                </option>
              ))}
            </select>

            {selectedMinutes && (
              <p className="mt-2 text-sm text-gray-600">
                Deadline time: <strong>{getDeadlinePreview()}</strong>
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleAssign}
            className="w-full bg-yellow-400 text-emerald-900 font-semibold py-2 rounded hover:opacity-90 transition"
            disabled={isSubmiting}
          >
            {isSubmiting ? "Please wait ..." : "Assign Task"}
          </button>

        </div>
      )}
    </div>
  );
};

export default ManageReports;
