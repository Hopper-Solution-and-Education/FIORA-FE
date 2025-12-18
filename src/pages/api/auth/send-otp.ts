import reNewPasswordUseCase from '@/features/auth/application/use-cases/reNewPassword';
import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { generateOtp } from '@/shared/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'POST') {
        return response.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({
          status: RESPONSE_CODE.METHOD_NOT_ALLOWED,
          message: Messages.METHOD_NOT_ALLOWED,
          data: null,
        });
      }

      const { email } = request.body;

      if (!email) {
        return response.status(RESPONSE_CODE.BAD_REQUEST).json({
          status: RESPONSE_CODE.BAD_REQUEST,
          message: Messages.EMAIL_IS_REQUIRED,
          data: null,
        });
      }

      // Check if user exists
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return response.status(RESPONSE_CODE.NOT_FOUND).json({
          status: RESPONSE_CODE.NOT_FOUND,
          message: Messages.USER_NOT_FOUND,
          data: null,
        });
      }

      // Generate OTP
      const otp = generateOtp();

      // Send OTP via email using notification use case
      await reNewPasswordUseCase.sendOtpForgotPassword(email, otp);

      response.status(RESPONSE_CODE.OK).json({
        status: RESPONSE_CODE.OK,
        message: Messages.SEND_OTP_SUCCESS,
      });
    },
    req,
    res,
  );
