'use client';

import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useEffect, useState } from 'react';

interface DeleteAccountOtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (otp: string) => void;
  onResendOTP: () => void;
  isLoading?: boolean;
  isSendingOTP?: boolean;
}

const COUNTDOWN_DURATION = 60; // 60 seconds

export const DeleteAccountOtpDialog: FC<DeleteAccountOtpDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onResendOTP,
  isLoading = false,
  isSendingOTP = false,
}) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0 && open) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, open]);

  // Reset countdown when dialog opens
  useEffect(() => {
    if (open) {
      setCountdown(COUNTDOWN_DURATION);
      setOtp('');
    }
  }, [open]);

  const handleResendOTP = () => {
    setCountdown(COUNTDOWN_DURATION);
    onResendOTP();
  };

  const handleConfirm = () => {
    if (!otp) return;
    onConfirm(otp);
  };

  const handleClose = () => {
    setOtp('');
    setCountdown(COUNTDOWN_DURATION);
    onOpenChange(false);
  };

  const isResendEnabled = countdown === 0 && !isSendingOTP && !isLoading;

  return (
    <GlobalDialog
      open={open}
      onOpenChange={(open) => {
        if (!isLoading) {
          if (!open) handleClose();
          else onOpenChange(open);
        }
      }}
      title="Verify OTP to Delete Account"
      description="Enter the OTP sent to your email."
      variant="danger"
      type="danger"
      isLoading={isLoading}
      disabled={!otp || otp.length !== 6}
      cancelText="Cancel"
      confirmText="Confirm Deletion"
      onCancel={handleClose}
      onConfirm={handleConfirm}
      renderContent={() => (
        <div className="space-y-4 mb-4">
          {/* OTP Input */}
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
        </div>
      )}
    />
  );
};

export default DeleteAccountOtpDialog;
