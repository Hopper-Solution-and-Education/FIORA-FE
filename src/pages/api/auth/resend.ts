import { errorHandler } from '@/shared/lib/responseUtils/errors';
import redis from '@/config/redis/redis';
import { sendEmail } from '@/config/send-grid/sendGrid';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  errorHandler(handler, req, res);

export default errorHandlerWrapper;
