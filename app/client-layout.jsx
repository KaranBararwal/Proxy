// app/client-layout.jsx
"use client"; // ✅ Must be a Client Component

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProxyAIAssistant from "@/components/ProxyAIAssistant";

export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
      <ProxyAIAssistant />
    </SessionProvider>
  );
}