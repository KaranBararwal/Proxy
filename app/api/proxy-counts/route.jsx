import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Proxy from '@/models/Proxy';
import { connectToDB } from '@/utils/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  await connectToDB();

  const markedByCount = await Proxy.countDocuments({ markedBy: session.user.email });
  const markedForCount = await Proxy.countDocuments({ markedFor: session.user.name });

  return new Response(JSON.stringify({ markedByCount, markedForCount }), { status: 200 });
}
