// app/api/forgot-password/route.js

import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import sendEmail from "@/utils/sendEmail";

export async function POST(req) {
  try {
    await connectToDB();

    const { email } = await req.json();

    const user = await User.findOne({ email });

    // Always respond the same to avoid email enumeration
    const genericMessage = {
      message: "If that email exists, a reset link has been sent.",
    };

    if (!user) {
      return new Response(JSON.stringify(genericMessage), {
        status: 200,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    return new Response(JSON.stringify(genericMessage), {
      status: 200,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}