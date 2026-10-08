import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html }) {
  try {
    console.log("Sending email to:", to);

    const response = await resend.emails.send({
      from: "YourApp <onboarding@resend.dev>", // Use verified sender
      to,
      subject,
      html,
    });

    console.log("Resend response:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}