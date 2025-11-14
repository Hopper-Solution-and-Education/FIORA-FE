'use client';

import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useEffect, useState } from 'react';

interface ChangePhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhone?: string;
  onConfirm: (newPhone: string, otp: string) => void;
  onSendOTP: () => void;
  isLoading?: boolean;
  isSendingOTP?: boolean;
}

const COUNTDOWN_DURATION = 60; // 60 seconds

export const ChangePhoneDialog: FC<ChangePhoneDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onSendOTP,
  isLoading = false,
  isSendingOTP = false,
}) => {
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = () => {
    if (!newPhone || newPhone.length < 10) {
      return;
    }
    setOtpSent(true);
    setCountdown(COUNTDOWN_DURATION);
    onSendOTP();
  };

  const handleResendOTP = () => {
    setCountdown(COUNTDOWN_DURATION);
    onSendOTP();
  };

  const handleConfirm = () => {
    if (!newPhone || !otp) return;
    onConfirm(newPhone, otp);
  };

  const handleClose = () => {
    setNewPhone('');
    setOtp('');
    setOtpSent(false);
    setCountdown(0);
    onOpenChange(false);
  };

  const isResendEnabled = countdown === 0 && otpSent && !isSendingOTP && !isLoading;

  return (
    <GlobalDialog
      open={open}
      onOpenChange={(open) => {
        if (!isLoading) {
          if (!open) handleClose();
          else onOpenChange(open);
        }
      }}
      title="Change Phone Number"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum magna ac tellus imperdiet, nec moncus tortor tempor."
      variant="info"
      type="info"
      confirmText="Confirm"
      cancelText="Cancel"
      onConfirm={handleConfirm}
      isLoading={isLoading}
      renderContent={() => (
        <div className="space-y-4">
          {/* New Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="new-phone" className="text-sm font-medium text-gray-700">
              New Phone Number
            </Label>
            <Input
              id="new-phone"
              type="tel"
              placeholder="Enter new phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          {/* Send OTP Button */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isLoading || isSendingOTP || !newPhone}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Send OTP"
            >
              {isSendingOTP ? 'Sending...' : 'Send OTP'}
            </button>
          )}

          {/* OTP Input */}
          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                OTP
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength={6}
                className="text-sm"
                aria-label="OTP verification code"
              />
              <div className="text-end text-xs text-gray-600">
                {isResendEnabled ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-600 hover:text-blue-800 underline"
                    aria-label="Resend OTP"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span>{isSendingOTP ? 'Sending...' : `Resend in ${countdown}s`}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default ChangePhoneDialog;
