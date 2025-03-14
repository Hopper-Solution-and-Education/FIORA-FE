'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/utils';
import { validateOtp } from '@/shared/validation/signUpValidation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface VerifyOtpFormProps {
  email: string;
  setSuccessMessage: (message: string | null) => void;
  setError: (error: string | null) => void;
}

export function VerifyOTPForm({ email, setSuccessMessage, setError }: VerifyOtpFormProps) {
  const [otp, setOtp] = useState(''); // New state for OTP input
  const [fieldErrors, setFieldErrors] = useState({ otp: '' });
  const router = useRouter();

  const handleFieldChange = (value: string) => {
    setOtp(value);
    setFieldErrors({ otp: validateOtp(value) });
    setError(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (otp.length !== 6 || fieldErrors.otp) {
      setFieldErrors({ otp: validateOtp(otp) || 'OTP must be 6 digits' });
      return;
    }

    try {
      const res = await fetch('/api/auth/verifyRegister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      setSuccessMessage(data.message);
      setTimeout(() => router.push('/auth/sign-in'), 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
      setSuccessMessage(data.message);
    } catch (err: any) {
      setError(err.message || 'An error occurred during OTP resend');
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-3">
      <div className="grid gap-2 mt-2">
        <Label htmlFor="otp">One-Time Password (OTP)</Label>
        <Input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => handleFieldChange(e.target.value)}
          placeholder="Enter 6-digit OTP"
          required
          className={cn('border-gray-300', fieldErrors.otp && 'border-red-500')}
        />
        {fieldErrors.otp && <p className="text-red-500 text-sm mt-1">{fieldErrors.otp}</p>}
      </div>
      <Button type="submit" className="w-full mt-4">
        Verify Email
      </Button>
      <p className="text-center text-sm text-muted-foreground mt-2">
        Didn’t receive an OTP?{' '}
        <button
          onClick={handleResend}
          type="submit" // Prevent form submission
          className="underline underline-offset-4 hover:text-primary"
        >
          Resend
        </button>
      </p>
    </form>
  );
}
