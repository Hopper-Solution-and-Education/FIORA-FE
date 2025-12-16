import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { createDefaultCategories } from '@/features/auth/application/use-cases/defaultCategories';
import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { Messages } from '@/shared/constants';
import { BadRequestError } from '@/shared/lib';
import { buildReferralCodeCandidate, REFERRAL_CODE_MAX_ATTEMPTS } from '@/shared/utils/common';

import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

async function generateUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < REFERRAL_CODE_MAX_ATTEMPTS; attempt += 1) {
    const code = buildReferralCodeCandidate();
    const existing = await prisma.user.findUnique({ where: { referral_code: code } });
    if (!existing) {
      return code;
    }
  }

  throw new BadRequestError(Messages.FAILED_TO_GENERATE_UNIQUE_REFERRAL_CODE_FOR_USER);
}

function isReferralCodeUniqueConstraintError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  if (error.code !== 'P2002') {
    return false;
  }

  const target = error.meta?.target;
  if (Array.isArray(target)) {
    return target.includes('referral_code');
  }

  return typeof target === 'string' && target.includes('referral_code');
}

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
            role: true,
            isBlocked: true,
            isDeleted: true,
          },
        });

        if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
          // Check if user is blocked
          if (user.isBlocked) {
            throw new Error(Messages.USER_BLOCKED_SIGNIN_ERROR);
          }

          // Check if user is deleted
          if (user.isDeleted) {
            throw new Error(Messages.USER_DELETED_SIGNIN_ERROR);
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
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
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              isBlocked: true,
              isDeleted: true,
            },
          });

          // Create new user if not exists and default data
          if (!dbUser) {
            // Track created entities for potential rollback
            let createdUserId: string | null = null;
            let createdAccountId: string | null = null;
            let membershipProgressCreated = false;
            let categoriesCreated = false;
            let walletsCreated = false;

            try {
              // Step 1: Create user with unique referral code (retry logic)
              let userCreated = false;
              for (
                let attempt = 0;
                attempt < REFERRAL_CODE_MAX_ATTEMPTS && !userCreated;
                attempt += 1
              ) {
                const referralCode = await generateUniqueReferralCode();

                try {
                  dbUser = await prisma.user.create({
                    data: {
                      email: profile.email,
                      name: profile.name || 'Google User',
                      image: profile.image || user.image,
                      role: 'User',
                      isDeleted: false,
                      isBlocked: false,
                      referral_code: referralCode,
                    },
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                      role: true,
                      isBlocked: true,
                      isDeleted: true,
                    },
                  });
                  createdUserId = dbUser.id;
                  userCreated = true;
                } catch (error) {
                  if (isReferralCodeUniqueConstraintError(error)) {
                    if (attempt === REFERRAL_CODE_MAX_ATTEMPTS - 1) {
                      throw new BadRequestError(
                        Messages.FAILED_TO_GENERATE_UNIQUE_REFERRAL_CODE_FOR_USER,
                      );
                    }
                    continue;
                  }
                  throw error;
                }
              }

              if (!dbUser) {
                throw new BadRequestError(Messages.SIGNUP_USER_FAILED);
              }
              createdUserId = dbUser.id;

              // Step 2: Create default Account
              try {
                const accountCreate = await AccountUseCaseInstance.create({
                  name: 'Payment',
                  userId: dbUser.id,
                  balance: 0,
                  currency: 'VND',
                  type: 'Payment',
                  icon: 'wallet',
                });

                if (!accountCreate) {
                  throw new BadRequestError(Messages.ACCOUNT_CREATE_FAILED);
                }
                createdAccountId = accountCreate.id;
              } catch (accountError) {
                console.error('Account creation failed for Google user:', accountError);
                // Rollback: Delete user
                await prisma.user.delete({ where: { id: createdUserId } });
                throw new BadRequestError(Messages.ACCOUNT_CREATE_FAILED);
              }

              // Step 3: Create default membership progress
              try {
                await membershipSettingUseCase.createNewMembershipProgress(dbUser.id);
                membershipProgressCreated = true;
              } catch (membershipError) {
                console.error(
                  'Membership progress creation failed for Google user:',
                  membershipError,
                );
                // Rollback: Delete account and user
                await prisma.account
                  .delete({ where: { id: createdAccountId! } })
                  .catch(console.error);
                await prisma.user.delete({ where: { id: createdUserId } }).catch(console.error);
                throw new BadRequestError(Messages.MEMBERSHIP_PROGRESS_CREATE_FAILED);
              }

              // Step 4: Create default categories
              try {
                const categoriesResult = await createDefaultCategories(dbUser.id);
                if (!categoriesResult) {
                  // throw new Error('Failed to create default categories');
                  throw new BadRequestError(Messages.CATEGORY_CREATE_FAILED);
                }
                categoriesCreated = true;
              } catch (categoriesError) {
                console.error('Categories creation failed for Google user:', categoriesError);
                // Rollback: Delete categories, membership progress, account, and user
                await prisma.category
                  .deleteMany({ where: { userId: createdUserId } })
                  .catch(console.error);
                await prisma.membershipProgress
                  .deleteMany({ where: { userId: createdUserId } })
                  .catch(console.error);
                await prisma.account
                  .delete({ where: { id: createdAccountId! } })
                  .catch(console.error);
                await prisma.user.delete({ where: { id: createdUserId } }).catch(console.error);
                throw new BadRequestError(Messages.CATEGORY_CREATE_FAILED);
              }

              // Step 5: Create default wallets
              try {
                const wallets = await walletUseCase.getAllWalletsByUser(dbUser.id);
                if (!wallets || wallets.length === 0) {
                  throw new BadRequestError(Messages.WALLET_CREATE_FAILED);
                }
                walletsCreated = true;
              } catch (walletsError) {
                console.error('Wallets creation failed for Google user:', walletsError);
                // Rollback: Delete everything
                await prisma.wallet
                  .deleteMany({ where: { userId: createdUserId } })
                  .catch(console.error);
                await prisma.category
                  .deleteMany({ where: { userId: createdUserId } })
                  .catch(console.error);
                await prisma.membershipProgress
                  .deleteMany({ where: { userId: createdUserId } })
                  .catch(console.error);
                await prisma.account
                  .delete({ where: { id: createdAccountId! } })
                  .catch(console.error);
                await prisma.user.delete({ where: { id: createdUserId } }).catch(console.error);
                throw new BadRequestError(Messages.WALLET_CREATE_FAILED);
              }

              console.log(
                `Successfully created Google user with all default resources: ${dbUser.id}`,
              );
            } catch (error) {
              console.error('Error creating Google user with default resources:', error);
              return false;
            }
          } else {
            if (dbUser.isBlocked) {
              throw new BadRequestError(Messages.USER_BLOCKED_SIGNIN_ERROR);
            }

            if (dbUser.isDeleted) {
              throw new BadRequestError(Messages.USER_DELETED_SIGNIN_ERROR);
            }

            await prisma.user.update({
              where: { email: profile.email },
              data: {
                name: profile.name || dbUser.name,
                image: profile.image || dbUser.image,
              },
            });
          }

          user.id = dbUser.id;
          user.role = dbUser.role;
          return true;
        } catch (error) {
          console.error('Error in Google sign-in callback:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.role = user.role as UserRole;
        token.rememberMe = user.rememberMe;

        const maxAge = user.rememberMe ? 60 * 60 * 24 : 30 * 60; // 24 giờ hoặc 30 phút
        const now = Math.floor(Date.now() / 1000);
        token.exp = now + maxAge;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any & { role: UserRole } }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string | null;
        session.user.email = token.email as string;
        session.user.name = token.name ?? '';
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
