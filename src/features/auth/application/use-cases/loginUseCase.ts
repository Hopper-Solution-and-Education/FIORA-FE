import { UserRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import { cookies } from 'next/headers';

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string, rememberMe: boolean): Promise<void> {
    const user = await this.userRepository.verifyPassword(email, password);
    if (!user) throw new Error('Invalid credentials');

    // Tạo session data (ví dụ: user ID trong cookie)
    const sessionData = {
      userId: user.id,
      email: user.email,
      expires: rememberMe
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 60 * 1000), // 24h or 30min
    };

    // Sử dụng cookies() từ Next.js 15 (hoặc Next.js 14) để đặt cookie
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: sessionData.expires,
      path: '/',
    });
  }
}
