import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  const username = req.nextUrl.searchParams.get('username');
  if (!username) return new Response(JSON.stringify({ available: false }), { status: 400 });

  await connectToDB();
  const existingUser = await User.findOne({ username });

  return new Response(JSON.stringify({ available: !existingUser }), { status: 200 });
}