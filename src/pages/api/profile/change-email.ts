import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

type ChangeEmailRequest = {
  newEmail: string;
  otp: string;
};

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'POST') {
        return response
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: Messages.METHOD_NOT_ALLOWED });
      }

      return POST(request, response, userId);
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { newEmail, otp } = req.body as ChangeEmailRequest;

  // Validation
  if (!newEmail || !otp) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Email and OTP are required'));
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid email format'));
  }

  // Use use case to handle email change with OTP verification
  const result = await profileUseCase.changeEmailWithOtp(userId, newEmail, otp);

  if (!result.success) {
    const statusCode =
      result.message === 'Email already in use'
        ? RESPONSE_CODE.CONFLICT
        : RESPONSE_CODE.BAD_REQUEST;

    return res.status(statusCode).json(createErrorResponse(statusCode, result.message));
  }

  return res.status(RESPONSE_CODE.OK).json({
    message: result.message,
    data: result.data,
    status: RESPONSE_CODE.OK,
  });
}
