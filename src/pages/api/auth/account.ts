import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateAccount } from '@/shared/validators/accountValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req, res) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response);
        case 'GET':
          return GET(request, response);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    },
    req,
    res,
  ),
);

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const { userId, name, type, currency, balance = 0, limit, parentId } = request.body;
  const isValid = validateAccount(type, balance, limit);
  if (!isValid) {
    response.status(400).json({ error: 'Invalid account type or balance' });
  }

  const userFound = await UserUSeCaseInstance.checkExistedUserById(userId);
  if (!userFound) {
    response.status(404).json({ error: 'User not found' });
  }

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

  response.status(201).json({ message: 'Account created successfully', account });
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accounts = await AccountUseCaseInstance.findAll();
  res.status(200).json({ accounts });
}
