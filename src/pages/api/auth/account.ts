import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateAccount } from '@/shared/validation/accountValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req, res) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    case 'GET':
      return GET(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { userId, name, type, currency, balance = 0, limit, parentId } = request.body;
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
      balance,
      limit,
      parentId,
      icon: 'circle',
    });
    // If this is a sub-account, update the parent's balance
    response.status(201).json({ message: 'Account created successfully', account });
  } catch (error: any) {
    response.status(error.status).json({ error: error.message });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const accounts = await AccountUseCaseInstance.findAll();
    res.status(200).json({ accounts });
  } catch (error: any) {
    res.status(error.status).json({ error: error.message });
  }
}
