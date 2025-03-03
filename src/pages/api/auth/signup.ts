import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { SignUpUseCase } from '@/features/auth/application/use-cases/signUpUseCase';
import { UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import { ConflictError, errorHandler, InternalServerError } from '@/lib/errors';
import redis from '@/lib/redis';
import { sendEmail } from '@/lib/sendGrid';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { AccountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { AccountUseCase } from '@/features/auth/application/use-cases/accountUseCase';

const userRepository = new UserRepository();
const accountRepository = new AccountRepository();

const signUpUseCase = new SignUpUseCase(userRepository);
const accountUseCase = new AccountUseCase(accountRepository);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  const userFound = await userRepository.findByEmail(email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Always 6 digits
  const BASE_URL = process.env.baseURL || 'http://localhost:3000';
  const PORT = process.env.PORT || '3000';

  const verificationLink = `${BASE_URL}:${PORT}/verify?email=${encodeURIComponent(email)}&otp=${otp}`;

  if (userFound && userFound.emailVerified) {
    throw new ConflictError('Email đã tồn tại');
  } else if (userFound && !userFound.emailVerified) {
    const otpCache = await redis.get(`otp:${email}`);
    if (otpCache) {
      return res
        .status(RESPONSE_CODE.OK)
        .json({ message: 'Đã gửi OTP, vui lòng kiểm tra email để tiếp tục đăng ký' });
    } else {
      await redis.setEx(`otp:${userFound.email}`, 5 * 60, otp); // Expire in 15 minutes
      await sendEmail(email, otp, verificationLink);
      return res
        .status(RESPONSE_CODE.OK)
        .json({ message: 'Đã gửi OTP, vui lòng kiểm tra email để tiếp tục đăng ký' });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userCreationRes = await signUpUseCase.execute(email, hashedPassword);
  if (!userCreationRes) {
    throw new InternalServerError('Không thể tạo tài khoản');
  }
  await accountUseCase.create({
    userId: userCreationRes.id,
  });

  await redis.setEx(`otp:${email}`, 5 * 60, otp); // Expire in 5 minutes
  // Send OTP to email
  await sendEmail(email, otp, verificationLink);
  res
    .status(RESPONSE_CODE.OK)
    .json({ message: 'Đăng ký thành công, Check OTP để tiếp tục đăng ký' });
}

const errorHandlerWrapper = (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(handler, req, res);

export default errorHandlerWrapper;
