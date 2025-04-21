import { verifyJwt } from '@/lib/jwt';
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let user;
    try {
      user = await verifyJwt(token);
    } catch (err) {
      console.error('JWT verification failed:', err);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!user?.email) {
      console.warn('Token decoded but no email found:', user);
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      await connectToDB();
    } catch (err) {
      console.error('DB connection error:', err);
      return new Response(JSON.stringify({ error: 'Database connection failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const proxies = await Proxy.find({ markedBy: user.email, status: 'accepted' });

    return new Response(JSON.stringify(proxies), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching proxies:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch proxies' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}