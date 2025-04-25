import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authOptions = {
  providers: [
    // 🔐 Credentials Login
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

        return {
          id: user._id,
          name: user.username,
          email: user.email,
          hasPassword: !!user.password,
        };
      },
    }),

    // 🟢 Google OAuth Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      await connectToDB();

      // Google Sign-In Handling
      if (account?.provider === 'google') {
        let existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          // First time Google login — create user without password
          existingUser = await User.create({
            email: profile.email,
            username: null,
            // username: profile.name.replace(/\s+/g, '').toLowerCase(),
            password: null,
          });
        }

        token.user = {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.username,
          hasPassword: !!existingUser.password,
        };
      }

      // Credentials Login Handling
      if (user && account?.provider === 'credentials') {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          hasPassword: !!user.hasPassword,
        };
      }

      // Add signed JWT token
      token.accessToken = jwt.sign({ user: token.user }, process.env.JWT_SECRET);
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.token = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: '/login', // Optional: custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };