import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import Proxy from '@/models/Proxy';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }), 
        { status: 401 }
      );
    }


    await connectToDB();

    const proxies = await Proxy.find({ 
      markedBy: session.user.email, 
      }).sort({ date : -1});

    return new Response(
      JSON.stringify(proxies), 
      { status: 200,}
    );

  } catch (error) {
    console.error('GET /api/proxies/by-you ERROR:', error);

    return new Response(
      JSON.stringify({
         error: 'Failed to fetch proxies'
        }),
        {status: 500}
    );
  }
}