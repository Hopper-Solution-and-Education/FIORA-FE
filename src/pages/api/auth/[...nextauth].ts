import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

// Extend the User interface to include rememberMe
declare module 'next-auth' {
  interface User {
    rememberMe?: boolean;
  }
  interface Session {
    user: User & { id: string };
    expiredTime: number;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    expiredTime: number;
    rememberMe?: boolean;
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember me', type: 'checkbox' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            rememberMe: credentials.rememberMe === 'true', // Convert string to boolean
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    // maxAge will be set dynamically in the jwt callback
  },
  callbacks: {
    async jwt({ token, trigger, user }) {
      // After sign in, create token with dynamic maxAge
      if (user) {
        token.id = user.id;
        token.rememberMe = user.rememberMe;

        // Set maxAge based on rememberMe (2 minutes if true, 1 minute if false)
        const maxAge = user.rememberMe ? 24 * 60 * 60 : 30 * 60; // 24 hours or 30 minutes
        const now = Math.floor(Date.now() / 1000);
        token.expiredTime = now + maxAge;
      }

      if (trigger === 'update' && token.expiredTime) {
        // trigger update session, then update expiredTime
        // Plus 30 minutes
        token.expiredTime = token.expiredTime + 30 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      session.expiredTime = token.expiredTime;
      return session;
    },
  },
});
