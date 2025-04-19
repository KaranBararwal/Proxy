// app/api/mark-proxy/route.js

import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';

export async function POST(req) {
  try {
    const { subject, date, markedBy, markedFor } = await req.json(); // 🟢 Removed 'student'
    await connectToDB();

    // Create the proxy with "pending" status
    const newProxy = new Proxy({
      subject,
      date,
      markedBy,
      markedFor,
      status: 'pending',
    });

    await newProxy.save();

    return new Response(
      JSON.stringify({ message: 'Proxy marked successfully' }),
      { status: 201 }
    );
  } catch (err) {
    console.error('Error in mark-proxy route:', err); // 🟢 Logs actual error
    return new Response(
      JSON.stringify({ message: 'Error marking proxy' }),
      { status: 500 }
    );
  }
}