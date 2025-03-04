import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import { errorHandler, NotFoundError, ValidationError } from '@/lib/errors';
import redis from '@/lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, otp } = req.body;

  const storedOTP = await redis.get(`otp:${email}`);

  if (!storedOTP || storedOTP !== otp) {
    throw new ValidationError('OTP không hợp lệ');
  }

  const user = await UserUSeCaseInstance.verifyEmail(email);
  if (!user) {
    throw new NotFoundError('Tài khoản không tồn tại');
  }

  if (user.emailVerified) {
    throw new ValidationError('Email đã được xác thực');
  }

  await UserUSeCaseInstance.verifyUser(email);
  await redis.del(`otp:${email}`);

  res.status(200).json({ message: 'Tài khoản đã xác thực thành công ! Vui lòng đăng nhập' });
}

const errorHandlerWrapper = (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(handler, req, res);

export default errorHandlerWrapper;
