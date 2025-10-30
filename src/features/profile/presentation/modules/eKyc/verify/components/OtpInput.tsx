'use client';

import { Input } from '@/components/ui/input';
import { FC, useEffect, useState } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onResend: () => void;
  disabled?: boolean;
  isSendingOtp?: boolean;
}

const COUNTDOWN_DURATION = 60; // 60 seconds

export const OtpInput: FC<OtpInputProps> = ({
  value,
  onChange,
  onResend,
  disabled,
  isSendingOtp,
}) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    onResend();
    setCountdown(COUNTDOWN_DURATION); // Reset countdown
  };

  const isResendEnabled = countdown === 0 && !isSendingOtp && !disabled;

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Input
          id="otp-input"
          type="text"
          placeholder="OTP"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
          disabled={disabled}
          maxLength={6}
          aria-label="OTP verification code"
        />
        <div className="text-end text-xs text-gray-600">
          {isResendEnabled ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-800 underline"
              aria-label="Resend OTP"
            >
              Resend OTP
            </button>
          ) : (
            <span>{isSendingOtp ? 'Sending...' : `Resend in ${countdown}s`}</span>
          )}
        </div>
      </div>
    </div>
  );
};
