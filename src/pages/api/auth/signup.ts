import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import { AppError, InternalServerError } from '@/lib/errors';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST(req, res);
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;

    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Always 6 digits
    // const BASE_URL = process.env.baseURL || 'http://localhost:3000';
    // const PORT = process.env.PORT || '3000';

    // const verificationLink = `${BASE_URL}:${PORT}/verify?email=${encodeURIComponent(email)}&otp=${otp}`;

    // if (userFound && userFound.emailVerified) {
    //   throw new ConflictError('Email đã tồn tại');
    // } else if (userFound && !userFound.emailVerified) {
    //   const otpCache = await redis.get(`otp:${email}`);
    //   if (otpCache) {
    //     return res
    //       .status(RESPONSE_CODE.OK)
    //       .json({ message: 'Đã gửi OTP, vui lòng kiểm tra email để tiếp tục đăng ký' });
    //   } else {
    //     await redis.setEx(`otp:${userFound.email}`, 5 * 60, otp); // Expire in 15 minutes
    //     await sendEmail(email, otp, verificationLink);
    //     return res
    //       .status(RESPONSE_CODE.OK)
    //       .json({ message: 'Đã gửi OTP, vui lòng kiểm tra email để tiếp tục đăng ký' });
    //   }
    // }

    const userCreationRes = await UserUSeCaseInstance.execute(email, password);

    if (!userCreationRes) {
      throw new InternalServerError('Không thể tạo tài khoản');
    }

    // create new Account
    await AccountUseCaseInstance.create({
      name: 'Ví tiền payment',
      userId: userCreationRes.id,
      balance: 0,
      currency: 'VND',
      type: 'Payment',
    });

    res
      .status(RESPONSE_CODE.CREATED)
      .json({ message: 'Đăng ký thành công', user: userCreationRes });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error creating user:', error);
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Đã có lỗi xảy ra' });
  }
}
