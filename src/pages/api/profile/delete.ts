import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { OtpType } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type DeleteAccountRequest = {
  otp: string;
};

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'DELETE') {
        return response
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: Messages.METHOD_NOT_ALLOWED });
      }

      return DELETE(request, response, userId);
    },
    req,
    res,
  ),
);

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { otp } = req.body as DeleteAccountRequest;

  // Validation
  if (!otp) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'OTP is required'));
  }

  // Get user profile
  const profile = await profileUseCase.getById(userId);
  if (!profile) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.USER_NOT_FOUND));
  }

  // Verify OTP
  const verification = await profileUseCase.verifyOtp(userId, otp, OtpType.DELETE);
  if (!verification.isValid) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, verification.message || 'Invalid OTP'));
  }

  // TODO: Check if user has any active transactions/subscriptions
  // const hasActiveTransactions = await transactionService.hasActiveTransactions(userId);
  // if (hasActiveTransactions) {
  //   return res.status(RESPONSE_CODE.BAD_REQUEST).json({
  //     message: 'Cannot delete account with active transactions',
  //     status: RESPONSE_CODE.BAD_REQUEST,
  //   });
  // }

  // Soft delete user account
  // This will:
  // 1. Delete all sessions (logout from all devices)
  // 2. Mark user as deleted (isDeleted = true, deletedAt = now)
  await profileUseCase.softDelete(userId);

  // Note: For JWT-based auth, existing tokens remain valid until expiration
  // If strict immediate logout is required, implement JWT blacklist
  // (e.g., store invalidated tokens in Redis with TTL = token expiry time)

  // TODO: Send account deletion confirmation email
  // await emailService.sendAccountDeletionConfirmation(profile.email);

  return res.status(RESPONSE_CODE.OK).json({
    message: 'Account deleted successfully',
    status: RESPONSE_CODE.OK,
  });
}
