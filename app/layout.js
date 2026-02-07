import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
// ✅ Load your local fonts



export const metadata = {
  title: "CLEANING MANAGEMENT - Assigning Task",
  description: "WEB BASED CLEANING MANAGEMENT SYSTEM ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body  className="text-gray-700">

        <SessionProviderWrapper>
          <Toaster />

          {children}
        </SessionProviderWrapper>



      </body>
    </html>
  );
}
