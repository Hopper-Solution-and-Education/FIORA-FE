import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import { createDefaultCategories } from '@/features/auth/application/use-cases/defaultCategories';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';

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
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Cannot create user' });
  }

  // create new Account
  const accountCreate = await AccountUseCaseInstance.create({
    name: 'Payment',
    userId: userCreationRes.id,
    balance: 0,
    currency: 'VND',
    type: 'Payment',
    icon: '',
  });

  // Create new membership progress
  await membershipSettingUseCase.createNewMembershipProgress(userCreationRes.id);
  if (!accountCreate) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Cannot create account'));
  }

  // Create default categories
  const categoriesCreated = await createDefaultCategories(userCreationRes.id);
  if (!categoriesCreated) {
    console.error('Failed to create default categories for user:', userCreationRes.id);
    // We don't return an error here as the user is already created
  }

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(RESPONSE_CODE.CREATED, 'You have registered for an account successfully!'),
    );
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
