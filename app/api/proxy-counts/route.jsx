import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Proxy from '@/models/Proxy';
import { connectToDB } from '@/utils/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await connectToDB();

    // Only count accepted proxies
    const markedByCount = await Proxy.countDocuments({
      markedBy: session.user.email,
      status: 'accepted',
    });

    const markedForCount = await Proxy.countDocuments({
      markedFor: session.user.name,
      status: 'accepted',
    });

    return new Response(JSON.stringify({ markedByCount, markedForCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error fetching proxy counts:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}