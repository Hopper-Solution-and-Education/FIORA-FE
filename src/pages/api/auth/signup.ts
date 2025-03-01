import { NextApiRequest, NextApiResponse } from 'next';
import { SignUpUseCase } from '@/features/auth/application/use-cases/signUpUseCase';
import { UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;
    const userRepository = new UserRepository();
    const signUpUseCase = new SignUpUseCase(userRepository);

    const isDuplicatedEmail = await userRepository.findByEmail(email);
    if (isDuplicatedEmail) {
      res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Email đã tồn tại' });
      return;
    }

    await signUpUseCase.execute(email, password);
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Đăng ký thất bại' });
  }
}
