import { prisma } from '@/config';
import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { createDefaultCategories } from '@/features/auth/application/use-cases/defaultCategories';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { BadRequestError, errorHandler } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';

// Rollback helper functions
async function rollbackUser(userId: string | null) {
  if (!userId) return;
  try {
    await prisma.user.delete({ where: { id: userId } });
    console.log(`Rolled back user: ${userId}`);
  } catch (error) {
    console.error(`Failed to rollback user ${userId}:`, error);
  }
}

async function rollbackAccount(accountId: string | null) {
  if (!accountId) return;
  try {
    await prisma.account.delete({ where: { id: accountId } });
    console.log(`Rolled back account: ${accountId}`);
  } catch (error) {
    console.error(`Failed to rollback account ${accountId}:`, error);
  }
}

async function rollbackMembershipProgress(userId: string | null) {
  if (!userId) return;
  try {
    await prisma.membershipProgress.deleteMany({ where: { userId } });
    console.log(`Rolled back membership progress for user: ${userId}`);
  } catch (error) {
    console.error(`Failed to rollback membership progress for user ${userId}:`, error);
  }
}

async function rollbackCategories(userId: string | null) {
  if (!userId) return;
  try {
    await prisma.category.deleteMany({ where: { userId } });
    console.log(`Rolled back categories for user: ${userId}`);
  } catch (error) {
    console.error(`Failed to rollback categories for user ${userId}:`, error);
  }
}

async function rollbackWallets(userId: string | null) {
  if (!userId) return;
  try {
    await prisma.wallet.deleteMany({ where: { userId } });
    console.log(`Rolled back wallets for user: ${userId}`);
  } catch (error) {
    console.error(`Failed to rollback wallets for user ${userId}:`, error);
  }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      if (request.method === 'POST') {
        return POST(request, response);
      }
      if (request.method === 'PATCH') {
        return PATCH(request, response);
      }
    },
    req,
    res,
  );

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body = await req.body;
  const { email, password } = body;

  // Track created entities for potential rollback
  let createdUserId: string | null = null;
  let createdAccountId: string | null = null;
  let membershipProgressCreated = false;
  let categoriesCreated = false;
  let walletsCreated = false;

  try {
    // Step 1: Create user
    const userCreationRes = await UserUSeCaseInstance.execute(email, password);
    if (!userCreationRes) {
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SIGNUP_USER_FAILED, code: RESPONSE_CODE.INTERNAL_SERVER_ERROR });
    }
    createdUserId = userCreationRes.id;

    // Step 2: Create default Account
    try {
      const accountCreate = await AccountUseCaseInstance.create({
        name: 'Payment',
        userId: userCreationRes.id,
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
      console.error('Account creation failed:', accountError);
      // Rollback: Delete user
      await rollbackUser(createdUserId);
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.ACCOUNT_CREATE_FAILED));
    }

    // Step 3: Create default membership progress
    try {
      await membershipSettingUseCase.createNewMembershipProgress(userCreationRes.id);
      membershipProgressCreated = true;
    } catch (membershipError) {
      console.error('Membership progress creation failed:', membershipError);
      // Rollback: Delete account and user
      await rollbackAccount(createdAccountId);
      await rollbackUser(createdUserId);
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json(
          createResponse(
            RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            Messages.MEMBERSHIP_PROGRESS_CREATE_FAILED,
          ),
        );
    }

    // Step 4: Create default categories
    try {
      const categoriesResult = await createDefaultCategories(userCreationRes.id);
      if (!categoriesResult) {
        throw new BadRequestError(Messages.CATEGORY_CREATE_FAILED);
      }
      categoriesCreated = true;
    } catch (categoriesError) {
      console.error('Categories creation failed:', categoriesError);
      // Rollback: Delete any partially created categories, membership progress, account, and user
      await rollbackCategories(createdUserId);
      await rollbackMembershipProgress(createdUserId);
      await rollbackAccount(createdAccountId);
      await rollbackUser(createdUserId);
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.CATEGORY_CREATE_FAILED));
    }

    // Step 5: Create default wallets
    try {
      const wallets = await walletUseCase.getAllWalletsByUser(userCreationRes.id);
      if (!wallets || wallets.length === 0) {
        throw new BadRequestError(Messages.WALLET_CREATE_FAILED);
      }
      walletsCreated = true;
    } catch (walletsError) {
      console.error('Wallets creation failed:', walletsError);
      // Rollback: Delete wallets, categories, membership progress, account, and user
      await rollbackWallets(createdUserId);
      await rollbackCategories(createdUserId);
      await rollbackMembershipProgress(createdUserId);
      await rollbackAccount(createdAccountId);
      await rollbackUser(createdUserId);
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.WALLET_CREATE_FAILED));
    }

    // All steps successful
    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.SIGNUP_SUCCESS));
  } catch (error) {
    // Unexpected error - rollback everything that was created
    console.error('Unexpected error during signup:', error);
    if (walletsCreated && createdUserId) await rollbackWallets(createdUserId);
    if (categoriesCreated && createdUserId) await rollbackCategories(createdUserId);
    if (membershipProgressCreated && createdUserId) await rollbackMembershipProgress(createdUserId);
    if (createdAccountId) await rollbackAccount(createdAccountId);
    if (createdUserId) await rollbackUser(createdUserId);

    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.SIGNUP_USER_FAILED));
  }
}

export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'Email is required and must be a string'));
  }

  const userFound = await UserUSeCaseInstance.verifyEmail(email);

  if (userFound) {
    return res.status(RESPONSE_CODE.NOT_ACCEPTABLE).json({ message: 'Email already exists' });
  }

  return res.status(RESPONSE_CODE.OK).json({ message: 'Email is available' });
}
