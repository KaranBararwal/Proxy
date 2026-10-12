// app/layout.js (SERVER COMPONENT — no "use client")

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout"; // ✅ We'll wrap the rest in a Client Component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Proxy Manager",
  description: "Manage proxy requests, track their status, and coordinate class coverage with ProxyManager.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout> {/* ✅ SessionProvider will live here */}
      </body>
    </html>
  );
}