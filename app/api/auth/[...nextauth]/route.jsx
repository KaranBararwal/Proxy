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

    const identifier = credentials?.email?.trim();
    const password = credentials?.password;

    if (!identifier || !password) {
      throw new Error('Username/email and password are required');
    }

    // Allow login using either email or username.
    const isEmail = identifier.includes('@');

    const user = await User.findOne(
      isEmail
        ? { email: identifier.toLowerCase() }
        : { username: { $regex: `^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
    );

    if (!user) {
      throw new Error('No account found with that username or email');
    }

    if (!user.password) {
      throw new Error(
        'No password is set for this account. Please use Google login or set a password.'
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return {
      id: user._id.toString(),
      name: user.username,
      email: user.email,
      hasPassword: true,
      role: user.role || 'student',
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
    async jwt({ token, user, account, profile, trigger}) {
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
          role: existingUser.role || 'student', // default to 'student' if role is not set
        };
      }

      // Credentials Login Handling
      if (user && account?.provider === 'credentials') {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          hasPassword: user.hasPassword,
          role: user.role || 'student', // default to 'student' if role is not set
        };
      }

      // Refresh user information from MonogDB when the client calls update()
      if(trigger === 'update' && token.user?.email){
        const existingUser = await User.findOne({
          email : token.user.email,
        });

        if(existingUser){
          token.user = {
            id : existingUser._id.toString(),
            email : existingUser.email,
            name : existingUser.username,
            hasPassword : !!existingUser.password,
            role: existingUser.role || 'student',
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
    if (token.user) {
        session.user = token.user;
    }
      return session;
    },
  },

  pages: {
    signIn: '/login', // Optional: custom login page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };