"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Loading from "@/components/Loading";
import Footer from "@/components/cleaner/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CleanerPendingReports = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch reports assigned to this cleaner
  const fetchReports = async (cleanerEmail) => {
    try {
      const res = await fetch("/api/report/assign", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch reports");

      // Filter only reports assigned to this cleaner
      const cleanerReports = (data.reports || []).filter(
        (report) => report.assignedCleaner?.email === cleanerEmail
      );

      setReports(cleanerReports);
    } catch (error) {
      console.error("Failed to fetch assigned reports:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Wait for session to load before fetching
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchReports(session.user.email);
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session]);

  // Accept task handler
  const handleAccept = async (reportId) => {
    if (!session?.user?.id) {
      alert("Authentication error: please log in again.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/report/accept-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          cleanerId: session.user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Task accepted and moved to In-progress");
      setSelectedReport(null);
      router.push("/cleaner/progress");
    } catch (error) {
      alert("Failed to accept task: " + error.message);
    }
  };

  // Helper to compute minutes left
  const getMinutesLeft = (deadline) => {
    if (!deadline) return null;
    const end = new Date(deadline);
    const now = new Date();
    return Math.round((end - now) / 60000);
  };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Your Assigned Tasks</h2>
          <div className="max-w-4xl rounded-md">
            {reports.length > 0 ? (
              reports.map((report) => {
                const minutesLeft = getMinutesLeft(report.deadline);

                return (
                  <div
                    key={report._id}
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
                        <span className="px-2 py-1 rounded text-xs bg-yellow-200 text-yellow-800 w-fit">
                          Assigned
                        </span>
                      </p>
                    </div>

                    {/* Reporter & Location */}
                    <div>
                      <p>
                        <span className="font-medium">
                          {report.firstName} {report.surname}
                        </span>
                        <br />
                        <span>{report.location}</span>
                      </p>

                      {/* Minutes left display */}
                      {report.deadline && (
                        <p
                          className={`mt-2 text-sm ${
                            minutesLeft > 0 ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          {minutesLeft > 0
                            ? `Deadline: ${minutesLeft} minutes left`
                            : "Deadline: Expired"}
                        </p>
                      )}
                    </div>

                    {/* Cleaner Info */}
                    <div className="my-auto text-sm text-emerald-700">
                      <p className="font-medium">Assigned To You</p>
                      <p>
                        {report.assignedCleaner?.firstName}{" "}
                        {report.assignedCleaner?.surname}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {report.assignedCleaner?.email}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-start gap-2">
                      <span>
                        Date: {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Accept Task
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">
                You have no assigned tasks at the moment.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
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
              <strong>Reporter:</strong>{" "}
              {selectedReport.firstName} {selectedReport.surname}
            </p>
            <p className="mb-2">
              <strong>Location:</strong> {selectedReport.location}
            </p>
            <p className="mb-2">
              <strong>Assigned To:</strong>{" "}
              {selectedReport.assignedCleaner?.firstName}{" "}
              {selectedReport.assignedCleaner?.surname}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {selectedReport.images?.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.url}
                  alt={`report_img_${idx}`}
                  width={200}
                  height={200}
                  className="rounded object-cover"
                />
              ))}
            </div>

            <button
              onClick={() => handleAccept(selectedReport._id)}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Accept Task
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CleanerPendingReports;
