import { connectToDB } from '@/utils/db';
import Proxy from '@/models/Proxy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  // 🛡️ Unauthorized access protection
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { subject, student, date } = body;

  // ❗ Validate required fields
  if (!subject || !student || !date) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
    });
  }

  try {
    await connectToDB();

    // 📅 Validate date format
    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
      });
    }

    // 🔁 Prevent duplicate proxy marking
    const existingProxy = await Proxy.findOne({
      student,
      subject,
      date,
      markedBy: session.user.email,
    });

    if (existingProxy) {
      return new Response(
        JSON.stringify({ error: 'Proxy already exists for this student' }),
        { status: 400 }
      );
    }

    // ✅ Create new proxy entry
    const newProxy = new Proxy({
      subject,
      student,
      date: new Date(date), // storing as Date object
      markedBy: session.user.email,
      markedFor: student,
      status: 'pending',
    });

    await newProxy.save();

    return new Response(JSON.stringify(newProxy), { status: 201 });

  } catch (err) {
    console.error('Error creating proxy:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to create proxy, please try again' }),
      { status: 500 }
    );
  }
}
