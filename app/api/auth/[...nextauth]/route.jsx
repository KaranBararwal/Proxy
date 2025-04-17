// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // 👈 import here if not already


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('No user found');
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error('Invalid password');
        return { id: user._id, name: user.username, email: user.email };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
    
        // ✅ create a real signed JWT
        const signedJwt = jwt.sign(
          { user: userPayload },
          process.env.JWT_SECRET,
          { expiresIn: '1h' } // optional
        );
    
        token.user = userPayload;
        token.accessToken = signedJwt; // 👈 store the real signed JWT
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      session.token = token.accessToken; // ✅ now contains real JWT
      return session;
    }    
  },
  
};

const handler = NextAuth(authOptions);

// Export both handler and authOptions
export { handler as GET, handler as POST };