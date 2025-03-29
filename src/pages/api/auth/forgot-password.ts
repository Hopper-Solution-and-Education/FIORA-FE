import { NextApiRequest, NextApiResponse } from 'next';
import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { ReNewPasswordUseCase } from '@/features/auth/application/use-cases/reNewPassword';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
    }
    const { email, newPassword } = req.body;

    const user = userRepository;
    const reNewPasswordUseCase = new ReNewPasswordUseCase(user);

    const updatedUser = await reNewPasswordUseCase.resetPassword(email, newPassword);

    res.status(RESPONSE_CODE.CREATED).json({
      message: 'Password reset successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Failed to reset password' });
  }
}
