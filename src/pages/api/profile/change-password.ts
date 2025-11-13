import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
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
  const { currentPassword, newPassword } = req.body as ChangePasswordRequest;

  // Validation
  if (!currentPassword || !newPassword) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({
      message: 'Current password and new password are required',
      status: RESPONSE_CODE.BAD_REQUEST,
    });
  }

  // Password strength validation
  if (newPassword.length < 8) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({
      message: 'Password must be at least 8 characters long',
      status: RESPONSE_CODE.BAD_REQUEST,
    });
  }

  // Check if new password is same as current password
  if (currentPassword === newPassword) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({
      message: 'New password must be different from current password',
      status: RESPONSE_CODE.BAD_REQUEST,
    });
  }

  // Get user with password
  const user = await profileUseCase.getByIdWithPassword(userId);
  if (!user) {
    return res.status(RESPONSE_CODE.NOT_FOUND).json({
      message: Messages.USER_NOT_FOUND,
      status: RESPONSE_CODE.NOT_FOUND,
    });
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return res.status(RESPONSE_CODE.UNAUTHORIZED).json({
      message: 'Current password is incorrect',
      status: RESPONSE_CODE.UNAUTHORIZED,
    });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await profileUseCase.updatePassword(userId, hashedPassword);

  return res.status(RESPONSE_CODE.OK).json({
    message: 'Password changed successfully',
    status: RESPONSE_CODE.OK,
  });
}
