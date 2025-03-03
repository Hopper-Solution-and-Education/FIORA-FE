import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import { validateAccount } from '@/shared/validation/accountValidation';
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
    const { userId, name, type, currency, balance = 0, limit, parentId } = body;

    // Validate account type and balance
    const isValid = validateAccount(type, balance, limit);
    if (!isValid) {
      response.status(400).json({ error: 'Invalid account type or balance' });
    }
    // Ensure user exists
    const userFound = await UserUSeCaseInstance.checkExistedUserById(userId);
    if (!userFound) {
      response.status(404).json({ error: 'User not found' });
    }
    // Create the account
    const account = await AccountUseCaseInstance.create({
      userId,
      name,
      type,
      currency,
      balance: balance,
      limit: limit,
      parentId,
    });

    // If this is a sub-account, update the parent's balance
    response.status(201).json({ message: 'Account created successfully', account });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}
