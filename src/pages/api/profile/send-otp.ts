import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

type SendOTPRequest = {
  type: 'email' | 'delete';
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
  const { type } = req.body as SendOTPRequest;

  // Validate OTP type
  if (!type || !['email', 'delete'].includes(type)) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json({ message: 'Invalid OTP type', status: RESPONSE_CODE.BAD_REQUEST });
  }

  // Get user profile
  const profile = await profileUseCase.getById(userId);
  if (!profile) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json({ message: Messages.USER_NOT_FOUND, status: RESPONSE_CODE.NOT_FOUND });
  }

  // Send OTP based on type
  try {
    switch (type) {
      case 'email':
        await profileUseCase.sendOtpForEmail(userId, profile.email);
        break;
      case 'delete':
        await profileUseCase.sendOtpForDelete(userId, profile.email);
        break;
    }

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.SEND_SUCCESS));
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to send OTP',
      status: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    });
  }
}
