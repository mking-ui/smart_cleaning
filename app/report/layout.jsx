"use client"
import Loading from "@/components/Loading";
import Navbar from "@/components/report/Navbar";
import Sidebar from "@/components/report/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ReportLayout = ({ children }) => {
 
 const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session to load

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "Reporter") {
      router.push("/"); // redirect non-supervisors to home
    }
  }, [status, session, router]);

  if (status === "loading" || !session) 
    return <Loading/>;
  
  return (
    <div>
      <Navbar  />
      <div className="flex w-full">
        <Sidebar  />
        {children}
      </div>
    </div>
  );
};

export default ReportLayout;
