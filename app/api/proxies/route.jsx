import { connectToDB } from '@/utils/db';
import Proxy from '@/models/Proxy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { subject, student, date } = body;

  // Basic validation for missing fields
  if (!subject || !student || !date) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
    });
  }

  try {
    await connectToDB();

    // Validate the date format (you can adjust it based on your needs)
    const isValidDate = Date.parse(date);
    if (isNaN(isValidDate)) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
      });
    }

    // Check if the proxy already exists
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

    // Create the new proxy
    const newProxy = new Proxy({
      subject,
      student,
      date,
      markedBy: session.user.email,
      markedFor: student,
      status: 'pending', // Default status set to 'pending'
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