import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    // 🔐 Credentials Login
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: { 
          label: 'Email',
          type: 'email'
        },
        password: {
          label: 'Password',
          type: 'password'
        },
      },

      async authorize(credentials) {
        await connectToDB();

        if(!credentials.email || !credentials.password) {
          throw new Error('Email and password are required');
        }

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user){ 
          throw new Error('No user found');
        }

        if(!user.password) {
          throw new Error('User has no password set. Please log in with Google or reset your password.');
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch){
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          hasPassword: true,
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
        let existingUser = await User.findOne({
          email: profile.email
        });

        if (!existingUser) {
          // First time Google login — create user without password
          existingUser = await User.create({
            email: profile.email,
            username: null,
            password: null,
          });
        }

        token.user = {
          id: existingUser._id.toString(),
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
          hasPassword: user.hasPassword,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },

  pages: {
    signIn: '/login', // Optional: custom login page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };