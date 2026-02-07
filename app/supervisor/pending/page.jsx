"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Footer from "@/components/supervisor/Footer";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // ✅ Optional toast for better UX

const PendingReports = () => {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  // ✅ Load cached reports first, then fetch fresh data
  useEffect(() => {
    const cached = localStorage.getItem("pendingReports");
    if (cached) {
      setReports(JSON.parse(cached));
      setLoading(false);
    }
    fetchReports(); // Always refresh in the background
  }, []);

  // ✅ Fetch pending reports (NextAuth handles session via cookies automatically)
  const fetchReports = async () => {
    try {
      const res = await fetch("/api/report/pending", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setReports(data.reports);
      localStorage.setItem("pendingReports", JSON.stringify(data.reports));
    } catch (error) {
      console.error("Failed to fetch pending reports:", error.message);
      toast.error("Failed to load pending reports");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle supervisor approval
  const handleApprove = async () => {
    try {
      const res = await fetch("/api/report/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reportId: selectedReport._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Update UI and cache after successful approval
      const updated = reports.filter((r) => r._id !== selectedReport._id);
      setReports(updated);
      localStorage.setItem("pendingReports", JSON.stringify(updated));
      setSelectedReport(null);
      toast.success("Report approved successfully!");
    } catch (error) {
      console.error("Approval failed:", error.message);
      toast.error(error.message || "Approval failed");
    }
  };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Pending Reports</h2>
          <div className="max-w-4xl rounded-md">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300 bg-yellow-50"
                >
                  {/* Reporter Info & Images */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    {report.images?.[0]?.url ? (
                      <Image
                        className="max-w-16 max-h-16 object-cover rounded"
                        src={report.images[0].url}
                        alt="report_image"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <Image
                        className="max-w-16 max-h-16"
                        src={assets.box_icon}
                        alt="box_icon"
                        width={64}
                        height={64}
                      />
                    )}
                    <p className="flex flex-col gap-2">
                      <span className="font-medium">{report.jobType}</span>
                      <span className="text-gray-600">{report.description}</span>
                      <span className="text-red-500 text-xs font-semibold">
                        Urgency: {report.urgency}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-yellow-200 text-yellow-800 w-fit">
                        Pending
                      </span>
                    </p>
                  </div>

                  {/* Reporter & Location */}
                  <div>
                    <p>
                      <span className="font-medium">{report.reporterName}</span>
                      <br />
                      <span>{report.location}</span>
                      <br />
                     
                    </p>
                  </div>

                  {/* Status */}
                  <div className="font-medium my-auto text-yellow-700">
                    Awaiting Assignment
                  </div>

                  {/* Date & View */}
                  <div className="flex flex-col items-start gap-2">
                    <span>
                      Date: {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Approve Report
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No pending reports found.</p>
            )}
          </div>
        </div>
      )}

      {/* ✅ Modal */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-3">{selectedReport.jobType}</h2>
            <p className="mb-2">{selectedReport.description}</p>
            <p className="mb-2">
              <strong>Reporter:</strong> {selectedReport.reporterName}
            </p>
            <p className="mb-2">
              <strong>Location:</strong> {selectedReport.location}
            </p>
           

            {/* Images */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {selectedReport.images?.length > 0 ? (
                selectedReport.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img.url}
                    alt={`report_img_${idx}`}
                    width={200}
                    height={200}
                    className="rounded object-cover"
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-2">No images available</p>
              )}
            </div>

            {/* Approve Button */}
            <button
              onClick={handleApprove}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PendingReports;
