import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  await connectToDB();

  const incomingProxies = await Proxy.find({
    markedFor: session.user.email,
    status: 'pending',
  });

  return new Response(JSON.stringify(incomingProxies), {
    status: 200,
  });
}
