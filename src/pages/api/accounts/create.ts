import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  switch (request.method) {
    case 'POST':
      return POST(request, response);
    default:
      return response.status(405).json({ error: 'Method not allowed' });
  }
}

// Create a new account
export async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const body = await request.body;

    const {
      userId = '99b4ca81-5348-4058-a66a-245f720115fa',
      name,
      type,
      currency,
      balance = 0,
      limit,
      icon,
      // parentId,
    } = body;

    const userFound = await UserUSeCaseInstance.checkExistedUserById(userId);
    if (!userFound) {
      response.status(404).json({ error: 'User not found' });
    }

    const isCreateMasterAccount = await AccountUseCaseInstance.isOnlyMasterAccount(userId, type);
    if (isCreateMasterAccount) {
      return response.status(400).json({ error: 'Master account already exists' });
    }
    // Create the account
    const account = await AccountUseCaseInstance.create({
      userId,
      name,
      type,
      icon,
      currency,
      balance: balance,
      limit: limit,
      // parentId,
    });

    // If this is a sub-account, update the parent's balance
    response.status(201).json({ message: 'Account created successfully', account });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}
