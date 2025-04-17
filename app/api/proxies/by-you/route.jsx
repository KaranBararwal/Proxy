import { verifyJwt } from '@/lib/jwt';
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), { status: 401 });
    }

    const user = await verifyJwt(token);
    if (!user || !user.email) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    await connectToDB();

    // ✅ Fix here: Match on email and status
    const proxies = await Proxy.find({ markedBy: user.email, status: 'accepted' });

    return new Response(JSON.stringify(proxies), { status: 200 });
  } catch (error) {
    console.error('Error fetching proxies:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch proxies' }), { status: 500 });
  }
}
