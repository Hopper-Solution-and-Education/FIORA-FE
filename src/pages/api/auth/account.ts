import { AccountUseCase } from '@/features/auth/application/use-cases/accountUseCase';
import { SignUpUseCase } from '@/features/auth/application/use-cases/signUpUseCase';
import { AccountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import prisma from '@/infrastructure/database/prisma';
import { errorHandler, NotFoundError } from '@/lib/errors';
import redis from '@/lib/redis';
import { sendEmail } from '@/lib/sendGrid';
import { validateAccount } from '@/shared/validation/accountValidation';
import { Decimal } from '@prisma/client/runtime/library';
import { NextApiRequest, NextApiResponse } from 'next';

const userRepository = new UserRepository();
const accountRepository = new AccountRepository();

const signUpUseCase = new SignUpUseCase(userRepository);
const accountUseCase = new AccountUseCase(accountRepository);

// Create a new account
export async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const body = await request.body;
    const { userId, name, type, currency, balance = 0, limit, parentId, description } = body;

    // Validate account type and balance
    validateAccount(type, balance, limit);

    // Ensure user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new NotFoundError('User not found');
    }

    // If parentId is provided, ensure the parent account exists and matches the type
    if (parentId) {
      const parentAccount = await prisma.account.findUnique({ where: { id: parentId } });
      if (!parentAccount || parentAccount.type !== type) {
        return new NotFoundError('Parent account not found or invalid type');
      }
    }

    const account = await prisma.account.create({
      data: {
        userId,
        icon: body.icon || 'default-icon.png', // Default or provided icon
        name,
        description: body.description || '',
        type,
        currency,
        balance: new Decimal(balance), // Convert to Decimal for Prisma
        limit: type === 'CreditCard' ? new Decimal(limit || 0) : null,
        parentId: parentId || null,
      },
    });

    // If this is a sub-account, update the parent's balance
    if (parentId) {
      await updateParentBalance(parentId);
    }

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;

  const storedOTP = await redis.get(`otp:${email}`);

  const BASE_URL = process.env.baseURL || 'http://localhost:3000';

  const PORT = process.env.PORT || '3000';
  const verificationLink = (otp: string) =>
    `${BASE_URL}:${PORT}/verify?email=${encodeURIComponent(email)}&otp=${otp}`;

  if (!storedOTP) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Always 6 digits

    await redis.setEx(`otp:${email}`, 5 * 60, otp); // Expire in 15 minutes
    await sendEmail(email, otp, verificationLink(otp));
  } else {
    return res
      .status(200)
      .json({ message: 'Đã gửi OTP, vui lòng kiểm tra email để tiếp tục đăng ký' });
  }
}
async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;

  const storedOTP = await redis.get(`otp:${email}`);

  const BASE_URL = process.env.baseURL || 'http://localhost:3000';

  const PORT = process.env.PORT || '3000';
  const verificationLink = (otp: string) =>
    `${BASE_URL}:${PORT}/verify?email=${encodeURIComponent(email)}&otp=${otp}`;

  if (!storedOTP) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Always 6 digits

    await redis.setEx(`otp:${email}`, 5 * 60, otp); // Expire in 15 minutes
    await sendEmail(email, otp, verificationLink(otp));
  } else {
    return res
      .status(200)
      .json({ message: 'Đã gửi OTP, vui lòng kiểm tra email để tiếp tục đăng ký' });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;

  const storedOTP = await redis.get(`otp:${email}`);

  const BASE_URL = process.env.baseURL || 'http://localhost:3000';

  const PORT = process.env.PORT || '3000';
  const verificationLink = (otp: string) =>
    `${BASE_URL}:${PORT}/verify?email=${encodeURIComponent(email)}&otp=${otp}`;

  if (!storedOTP) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Always 6 digits

    await redis.setEx(`otp:${email}`, 5 * 60, otp); // Expire in 15 minutes
    await sendEmail(email, otp, verificationLink(otp));
  } else {
    return res
      .status(200)
      .json({ message: 'Đã gửi OTP, vui lòng kiểm tra email để tiếp tục đăng ký' });
  }
}

const errorHandlerWrapper = (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler([], req, res);

export default errorHandlerWrapper;
