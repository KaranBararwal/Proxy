// app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Connect to the database
        await connectToDB();
        
        // Check if the user exists
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('No user found');
        
        // Check if the password matches
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error('Invalid password');
        
        return { id: user._id, name: user.username, email: user.email };
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Using JWT-based sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user; // Store user data in token
      return token;
    },
    async session({ session, token }) {
      session.user = token.user; // Attach user info to session
      return session;
    },
  },
});

// Export handler for both GET and POST methods
export { handler as GET, handler as POST };