import { createResponse } from '@/config/createResponse';
import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST(req, res);
  }
  if (req.method === 'PATCH') {
    return PATCH(req, res);
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await req.body;
    const { email, password } = body;
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
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: 'Cannot create user' });
    }

    // create new Account
    await AccountUseCaseInstance.create({
      name: 'Ví tiền payment',
      userId: userCreationRes.id,
      balance: 0,
      currency: 'VND',
      type: 'Payment',
      icon: 'circle',
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, 'You have registered for an account successfully!'),
      );
  } catch (error) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Đã có lỗi xảy ra' });
  }
}

export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json({ message: 'Email is required and must be a string' });
    }

    const userFound = await UserUSeCaseInstance.verifyEmail(email);

    if (userFound) {
      return res.status(RESPONSE_CODE.NOT_ACCEPTABLE).json({ message: 'Email already exists' });
    }

    return res.status(RESPONSE_CODE.OK).json({ message: 'Email is available' });
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json({ message: error?.message ?? 'An error has occured' });
  }
}
