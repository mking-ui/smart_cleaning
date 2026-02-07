"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { assets } from "@/assets/assets";
import Loading from "@/components/Loading";
import Footer from "@/components/report/Footer";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const ReportHistory = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please log in to view your reports.");
      router.push("/login");
    }
  }, [status, router]);

  // Fetch reports once authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchReports();
    }
  }, [status]);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/history", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load reports.");
        return;
      }

      setReports(data.reports);
      localStorage.setItem("reportHistory", JSON.stringify(data.reports));
    } catch (error) {
      console.error("Error fetching reports:", error.message);
      toast.error("Network error while loading reports.");
    } finally {
      setLoading(false);
    }
  };

 const getBadge = (status) => {
  const normalized = status?.toLowerCase() || "pending";
  if (normalized === "pending") {
    return (
      <span className="px-2 py-1 rounded text-xs bg-yellow-200 text-yellow-800">
        Pending (Waiting for Supervisor Approval)
      </span>
    );
  }
  if (normalized === "approved") {
    return (
      <span className="px-2 py-1 rounded text-xs bg-green-200 text-green-800">
        Approved (Cleaner Assigned)
      </span>
    );
  }
  if (normalized === "in progress") {
    return (
      <span className="px-2 py-1 rounded text-xs bg-blue-200 text-blue-800">
        In Progress (Cleaner Working)
      </span>
    );
  }
  if (normalized === "resolved") {
    return (
      <span className="px-2 py-1 rounded text-xs bg-purple-200 text-purple-800">
        Resolved (Awaiting Supervisor Final Approval)
      </span>
    );
  }
  if (normalized === "completed") {
    return (
      <span className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">
        Completed (Task Closed)
      </span>
    );
  }
};

const getSenderStatus = (status) => {
  const normalized = status?.toLowerCase() || "pending";
  if (normalized === "pending") return "Waiting for Approval";
  if (normalized === "approved") return "Approved - Cleaner Assigned";
  if (normalized === "in progress") return "Cleaner Working";
  if (normalized === "resolved") return "Resolved - Awaiting Supervisor Review";
  if (normalized === "completed") return "Completed";
  return "";
};

  if (status === "loading" || loading) return <Loading />;

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      <div className="md:p-10 p-4 space-y-5">
        <h2 className="text-lg font-medium">
          Report History for {session?.user?.firstName} {session?.user?.surname}
        </h2>

        <div className="max-w-4xl rounded-md">
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
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
                    <span>{getBadge(report.status)}</span>
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
                    <br />
                    {report.googleLocation && (
                      <a
                        href={report.googleLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Google Maps
                      </a>
                    )}
                  </p>
                </div>

                {/* Sender (Cleaner) Status */}
                <div className="font-medium my-auto">
                  {getSenderStatus(report.status)}
                </div>

                {/* Date */}
                <div>
                  <p className="flex flex-col">
                    <span>
                      Date: {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span>Status: {getSenderStatus(report.status)}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reports found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReportHistory;
