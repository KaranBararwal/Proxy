import { connectToDB } from '@/utils/db';
import Proxy from '@/models/Proxy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  await connectToDB();
  const proxies = await Proxy.find({ markedBy: session.user.email });
  return new Response(JSON.stringify(proxies), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { subject, student, date } = body;

  if (!subject || !student || !date) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
    });
  }

  await connectToDB();

  const newProxy = await Proxy.create({
    subject,
    student,
    date,
    markedBy: session.user.email,
  });

  return new Response(JSON.stringify(newProxy), { status: 201 });
}