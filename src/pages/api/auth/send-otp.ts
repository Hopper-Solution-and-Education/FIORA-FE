import reNewPasswordUseCase from '@/features/auth/application/use-cases/reNewPassword';
import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { generateOtp } from '@/shared/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'POST') {
        return response
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method not allowed' });
      }

      const { email } = request.body;

      if (!email) {
        return response.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Email is required' });
      }

      // Check if user exists
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return response.status(RESPONSE_CODE.NOT_FOUND).json({ error: 'User not found' });
      }

      // Generate OTP
      const otp = generateOtp();

      // Send OTP via email using notification use case
      await reNewPasswordUseCase.sendOtpForgotPassword(email, otp);

      response.status(RESPONSE_CODE.OK).json({
        message: 'OTP sent successfully',
        otp, // In production, don't return OTP in response, store it in session/cache
      });
    },
    req,
    res,
  );
