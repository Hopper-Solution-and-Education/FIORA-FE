'use client';
import ForgotPassword from './organisms/ForgotPasswordForm';

export default function ForgotPasswordnPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6">
      <div className="flex w-lg max-w-sm flex-col gap-6">
        <ForgotPassword />
      </div>
    </div>
  );
}
