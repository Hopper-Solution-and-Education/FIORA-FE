import { ReNewPasswordUseCase } from '@/features/auth/application/use-cases/reNewPassword';
import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'POST') {
        return response
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method not allowed' });
      }
      const { email, newPassword } = request.body;

      const user = userRepository;
      const reNewPasswordUseCase = new ReNewPasswordUseCase(user);

      const updatedUser = await reNewPasswordUseCase.resetPassword(email, newPassword);

      response.status(RESPONSE_CODE.CREATED).json({
        message: 'Password reset successfully',
        user: updatedUser,
      });
    },
    req,
    res,
  );
