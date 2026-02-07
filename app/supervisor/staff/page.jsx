"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/supervisor/Footer";
import Loading from "@/components/Loading";

export default function StaffReporterList() {
  const [staff, setStaff] = useState([]);
  const [reporters, setReporters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchAndSave();
  }, []);

  async function fetchAndSave() {
    setLoading(true);
    try {
      const [cleanerRes, reportersRes] = await Promise.all([
        fetch("/api/cleaner"),
        fetch("/api/reporter")
      ]);

      if (!cleanerRes.ok) {
        const text = await cleanerRes.text().catch(() => null);
        throw new Error(text || `Cleaner API error ${cleanerRes.status}`);
      }

      if (!reportersRes.ok) {
        const text = await reportersRes.text().catch(() => null);
        throw new Error(text || `Reporters API error ${reportersRes.status}`);
      }

      const cleanerData = await cleanerRes.json();
      const reportersData = await reportersRes.json();

      const cleaners = Array.isArray(cleanerData.cleaners) ? cleanerData.cleaners : [];
      const reps = Array.isArray(reportersData.reporters) ? reportersData.reporters : [];

      // Normalize and set state
      setStaff(
        cleaners.map(c => ({
          _id: c._id,
          name: c.name || `${c.firstName || ""} ${c.surname || ""}`.trim(),
          email: c.email || "",
          phone: c.phone || "",
          role: c.role || "Cleaner"
        }))
      );

      setReporters(
        reps.map(r => ({
          _id: r._id || r.email,
          name: r.name || r.email || "",
          email: r.email || "",
          phone: r.phone || "",
          role: r.role || "Reporter"
        }))
      );

      // Save locally
      try {
        localStorage.setItem("cleaners", JSON.stringify(cleaners));
        localStorage.setItem("reporters", JSON.stringify(reps));
      } catch (e) {
        console.warn("Could not save to localStorage:", e?.message || e);
      }
    } catch (err) {
    setStaff([]);
  setReporters([]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex-1 h-screen overflow-auto flex flex-col justify-between text-sm">
     {loading?(
      <Loading/>
     ):(  <div className="md:p-10 p-4 space-y-10">
        <section>
          <h2 className="text-lg font-medium mb-3">Cleaner List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Role</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No cleaners found</td>
                  </tr>
                ) : (
                  staff.map((s) => (
                    <tr key={s._id || s.email} className="border-b hover:bg-gray-50">
                      <td className="p-2 border">{s.name || "—"}</td>
                      <td className="p-2 border">{s.email || "—"}</td>
                      <td className="p-2 border">{s.phone || "—"}</td>
                      <td className="p-2 border">{s.role || "Cleaner"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-3">Reporter List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Role</th>
                </tr>
              </thead>
              <tbody>
                {reporters.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No reporters found</td>
                  </tr>
                ) : (
                  reporters.map((r) => (
                    <tr key={r._id || r.email} className="border-b hover:bg-gray-50">
                      <td className="p-2 border">{r.name || "—"}</td>
                      <td className="p-2 border">{r.email || "—"}</td>
                      <td className="p-2 border">{r.phone || "—"}</td>
                      <td className="p-2 border">{r.role || "Reporter"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>)}
    

      <Footer />
    </div>
  );
}
