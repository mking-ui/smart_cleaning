'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const ReportCleaningSpace = () => {
  const { data: session, status } = useSession();

  const [files, setFiles] = useState([]);
  const [firstName, setReporterFname] = useState("");
  const [surname, setReporterSname] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [jobType, setJobType] = useState("Spillage");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Autofill user info from session
  useEffect(() => {
    if (session?.user) {
      setReporterEmail(session.user.email || "");
      setReporterFname(session.user.firstName || "");
      setReporterSname(session.user.surname || "");
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (status === "unauthenticated") {
      toast.error("You must be logged in to submit a report.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("surname", surname);
      formData.append("reporterEmail", reporterEmail);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("urgency", urgency);
      formData.append("jobType", jobType);

      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const res = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Submission failed");
        return;
      }

      toast.success("Report submitted successfully!");
      console.log("Submitted Report:", data.report);

      // Reset form after success
      setDescription("");
      setFiles([]);
      setJobType("Spillage");
      setUrgency("Normal");
      setLocation("");
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading your profile...
      </div>
    );
  }

  // ✅ Handle unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Please log in to submit a report.
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen justify-between bg-slate-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 border max-w-3xl my-3 mx-auto w-full bg-white"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-900">
          Cleaning Space Report Form
        </h2>

        {/* Reporter Name & Email */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex flex-col gap-1 w-full sm:w-1/3">
            <label htmlFor="firstName" className="text-base font-medium">
              Reporter First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="outline-none py-2 px-3 rounded border border-gray-400 w-full bg-gray-100"
              value={firstName}
              readOnly
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-1/3">
            <label htmlFor="surname" className="text-base font-medium">
              Reporter Surname
            </label>
            <input
              id="surname"
              type="text"
              className="outline-none py-2 px-3 rounded border border-gray-400 w-full bg-gray-100"
              value={surname}
              readOnly
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-1/3">
            <label htmlFor="reporterEmail" className="text-base font-medium">
              Reporter Email
            </label>
            <input
              id="reporterEmail"
              type="email"
              className="outline-none py-2 px-3 rounded border border-gray-400 w-full bg-gray-100"
              value={reporterEmail}
              readOnly
              required
            />
          </div>
        </div>

        {/* Location & Google Location */}
       
          <div className="flex flex-col gap-1 w-full ">
            <label htmlFor="location" className="text-base font-medium">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="E.g. CBN, NEW BUILDING, SLT1, IT PARK ...."
              className="outline-none py-2 px-3 rounded border border-gray-400 w-full"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              required
            />
          </div>
   

        {/* Urgency & Job Type */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex flex-col gap-1 w-full sm:w-1/2">
            <label htmlFor="urgency" className="text-base font-medium">
              Urgency
            </label>
            <select
              id="urgency"
              className="outline-none py-2 px-3 rounded border border-gray-400 w-full"
              onChange={(e) => setUrgency(e.target.value)}
              value={urgency}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-1/2">
            <label htmlFor="jobType" className="text-base font-medium">
              Type of Cleaning Job
            </label>
            <select
              id="jobType"
              className="outline-none py-2 px-3 rounded border border-gray-400 w-full"
              onChange={(e) => setJobType(e.target.value)}
              value={jobType}
            >
              <option value="Spillage">Spillage</option>
              <option value="Trash Overflow">Trash Overflow</option>
              <option value="Dirty Restroom">Dirty Restroom</option>
              <option value="Sweeping Required">Sweeping Required</option>
              <option value="Mopping Required">Mopping Required</option>
              <option value="Sanitization">Sanitization</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="description" className="text-base font-medium">
            Description of Issue
          </label>
          <textarea
            id="description"
            rows={4}
            className="outline-none py-2 px-3 rounded border border-gray-400 resize-none w-full"
            placeholder="Briefly describe the cleaning issue"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        {/* Upload / Camera Capture */}
        <div>
          <p className="text-base font-medium">Capture / Upload Photo</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            {[...Array(2)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`} className="cursor-pointer flex-1">
                <input
                  type="file"
                  id={`image${index}`}
                  hidden
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files) {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }
                  }}
                />
                <div className="w-full h-40 border border-gray-400 rounded flex items-center justify-center overflow-hidden bg-gray-50">
                  {files[index] ? (
                    <Image
                      src={URL.createObjectURL(files[index])}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image src={assets.bg} alt="Upload" width={50} height={50} />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-8 py-2.5 text-emerald-900 bg-yellow-400 hover:text-yellow-400 font-medium rounded hover:bg-emerald-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait ...." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportCleaningSpace;
