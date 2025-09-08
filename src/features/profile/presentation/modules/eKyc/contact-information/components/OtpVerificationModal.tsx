'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check } from 'lucide-react';
import { FC, useEffect } from 'react';
import { OtpModalState } from '../../types';

type OtpVerificationModalProps = {
  otpModal: OtpModalState;
  onOtpModalChange: (modal: OtpModalState) => void;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend?: (type: 'email' | 'phone') => void;
};

const OtpVerificationModal: FC<OtpVerificationModalProps> = ({
  otpModal,
  onOtpModalChange,
  onClose,
  onVerify,
  onResend,
}) => {
  const handleOtpChange = (value: string) => {
    onOtpModalChange({ ...otpModal, otpValue: value });
  };

  // Countdown timer effect
  useEffect(() => {
    if (otpModal.isOpen && otpModal.countdown > 0) {
      const timer = setTimeout(() => {
        onOtpModalChange({ ...otpModal, countdown: otpModal.countdown - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpModal, onOtpModalChange]);

  const handleResend = () => {
    onResend?.(otpModal.type as 'email' | 'phone');
  };

  const isResendEnabled = otpModal.countdown === 0;

  return (
    <Dialog open={otpModal.isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg w-[450px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">
            Verify your {otpModal.type === 'email' ? 'email address' : 'phone number'}
          </DialogTitle>
          <DialogDescription className="text-center">
            We&apos;ve sent a verification code to{' '}
            {otpModal.type === 'email' ? otpModal.email : otpModal.phone}. Please enter code below
            to confirm your {otpModal.type === 'email' ? 'email' : 'phone number'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Input
              id="otp-input"
              type="text"
              placeholder="OTP"
              value={otpModal.otpValue}
              onChange={(e) => handleOtpChange(e.target.value)}
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
                `Resend in ${otpModal.countdown}s`
              )}
            </div>
          </div>

          <div className="flex gap-6 !mt-8">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              aria-label="Cancel OTP verification"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => {
                onVerify(otpModal.otpValue);
              }}
              disabled={!otpModal.otpValue.trim()}
              aria-label="Verify OTP"
            >
              <Check className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
