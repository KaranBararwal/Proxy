'use client'

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="cursor-pointer bg-blue-500 text-white w-full py-2 rounded">Send Reset Link</button>
      </form>
      {status && <p className="mt-4 text-sm text-green-600">{status}</p>}
    </div>
  );
}
