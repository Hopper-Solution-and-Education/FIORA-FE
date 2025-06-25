import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import { errorHandler, NotFoundError, ValidationError } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;

  const user = await UserUSeCaseInstance.verifyEmail(email);
  if (!user) {
    throw new NotFoundError('Tài khoản không tồn tại');
  }

  if (user.emailVerified) {
    throw new ValidationError('Email đã được xác thực');
  }

  await UserUSeCaseInstance.verifyUser(email);

  res.status(200).json({ message: 'Tài khoản đã xác thực thành công ! Vui lòng đăng nhập' });
}

const errorHandlerWrapper = (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(handler, req, res);

export default errorHandlerWrapper;
