'use client';
import { LoginForm } from '@/features/auth/presentation/organisms/LoginForm';

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6">
      <div className="flex w-lg max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
