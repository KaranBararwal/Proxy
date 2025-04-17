// app/api/mark-proxy/route.js
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';

export async function POST(req) {
  try {
    const { subject, student, date, markedBy, markedFor } = await req.json();
    await connectToDB();

    // Create the proxy with "pending" status
    const newProxy = new Proxy({
      subject,
      student,
      date,
      markedBy,
      markedFor,
      status: 'pending',
    });

    await newProxy.save();

    // You can implement sending a notification here for the target user
    // For example, using email or WebSocket to notify the user to accept/reject the proxy.

    return new Response(JSON.stringify({ message: 'Proxy marked successfully' }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error marking proxy' }), { status: 500 });
  }
}