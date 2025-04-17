import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Proxy from '@/models/Proxy';
import { connectToDB } from '@/utils/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    await connectToDB();

    const proxies = await Proxy.find({
      markedFor: session.user.name, // user receiving the proxy
      status: { $in: ['pending', 'accepted'] },  // $in if you want both pending + accepted
    });

    return new Response(JSON.stringify(proxies), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Error fetching proxies' }), {
      status: 500,
    });
  }
}
