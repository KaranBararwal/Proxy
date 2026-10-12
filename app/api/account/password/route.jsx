
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(req) {
  try {
    // Verify the user's session.
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Please sign in first.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const currentPassword =
      typeof body.currentPassword === 'string'
        ? body.currentPassword
        : '';
    const newPassword =
      typeof body.newPassword === 'string' ? body.newPassword : '';

    // Validate the new password.
    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json(
        { message: 'New password must be between 8 and 128 characters.' },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: 'User account not found.' },
        { status: 404 }
      );
    }

    // If the account already has a password, verify it first.
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Please enter your current password.' },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return NextResponse.json(
          { message: 'Your current password is incorrect.' },
          { status: 400 }
        );
      }

      // Prevent setting the same password again.
      const samePassword = await bcrypt.compare(
        newPassword,
        user.password
      );

      if (samePassword) {
        return NextResponse.json(
          { message: 'Your new password must differ from your current password.' },
          { status: 400 }
        );
      }
    }

    // Google-only accounts can set their first password while signed in.
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({
      message: user.password
        ? 'Password updated successfully.'
        : 'Password set successfully.',
    });
  } catch (error) {
    console.error('Password update failed:', error);

    return NextResponse.json(
      { message: 'Unable to update password. Please try again.' },
      { status: 500 }
    );
  }
}