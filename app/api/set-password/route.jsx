import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { password } = await req.json();
  if (!password || password.length < 6) {
    return new Response(JSON.stringify({ message: 'Password too short' }), { status: 400 });
  }

  try {
    await connectToDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
        { email: session.user.email },
        {
          password: hashedPassword,
          hasPassword: true, // ✅ Set this flag
        }
      );

    return new Response(JSON.stringify({ message: 'Password set successfully' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to set password' }), { status: 500 });
  }
}