// app/api/login/route.js
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@/lib/mongodb';

export async function POST(req) {
  const { email, password } = await req.json();
  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 400 });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // Store JWT secret in .env
      { expiresIn: '1h' }
    );

    // Store the token in MongoDB
    user.jwtToken = token;
    await user.save();

    // Return token in the response
    return new Response(
      JSON.stringify({ message: 'Login successful', token }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      { status: 500 }
    );
  }
}
