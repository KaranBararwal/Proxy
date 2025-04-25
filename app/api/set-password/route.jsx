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

  const { password, username } = await req.json();

  if (!password || password.length < 6) {
    return new Response(JSON.stringify({ message: 'Password too short' }), { status: 400 });
  }

  if (!username || username.trim().length < 3) {
    return new Response(JSON.stringify({ message: 'Username too short' }), { status: 400 });
  }

  try {
    await connectToDB();

    // Check if username is already taken (excluding current user)
    const existing = await User.findOne({
      username: username.toLowerCase(),
      email: { $ne: session.user.email },
    });

    if (existing) {
      return new Response(JSON.stringify({ message: 'Username already taken' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email: session.user.email },
      {
        $set: {
          password: hashedPassword,
          hasPassword: true,
          username: username.toLowerCase(),
        },
      }
    );

    return new Response(JSON.stringify({ message: 'Password and username set successfully' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to set password and username' }), { status: 500 });
  }
}