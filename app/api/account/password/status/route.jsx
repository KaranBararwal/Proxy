
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Please sign in first.' },
        { status: 401 }
      );
    }

    await connectToDB();

    const user = await User.findOne({
      email: session.user.email,
    }).select('password');

    if (!user) {
      return NextResponse.json(
        { message: 'User account not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hasPassword: Boolean(user.password),
    });
  } catch (error) {
    console.error('Password status check failed:', error);

    return NextResponse.json(
      { message: 'Unable to check password status.' },
      { status: 500 }
    );
  }
}