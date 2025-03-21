import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
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
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
          },
        });

        if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            rememberMe: credentials.rememberMe === 'true',
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
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || 'Google User',
                image: profile.image || user.image,
              },
            });

            // create new account
            await prisma.account.create({
              data: {
                name: 'Ví tiền payment',
                userId: dbUser.id,
                balance: 0,
                currency: 'VND',
                type: 'Payment',
                icon: 'wallet',
                createdBy: dbUser.id,
              },
            });
          } else {
            await prisma.user.update({
              where: { email: profile.email },
              data: {
                name: profile.name || dbUser.name,
                image: profile.image || dbUser.image,
              },
            });
          }

          user.id = dbUser.id;
          return true;
        } catch (error) {
          console.error('Error saving Google user to database:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.rememberMe = user.rememberMe;

        const maxAge = user.rememberMe ? 24 * 60 * 60 : 30 * 60; // 24 giờ hoặc 30 phút
        const now = Math.floor(Date.now() / 1000);
        token.expiredTime = now + maxAge;
      }

      // Session update
      if (trigger === 'update' && token.expiredTime) {
        token.expiredTime = token.expiredTime + 30 * 60;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string | null;
        session.user.email = token.email as string;
        session.user.name = token.name ?? '';
      }
      session.expiredTime = token.expiredTime as number;
      return session;
    },
  },
};

export default NextAuth(authOptions);
