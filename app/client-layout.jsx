// app/client-layout.jsx
"use client"; // ✅ Must be a Client Component

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-10 pb-24 px-4">
        {children}
      </div>
      <Footer />
    </SessionProvider>
  );
}