'use client';

import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useState } from 'react';

interface ChangePhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhone?: string;
  onConfirm: (newPhone: string, otp: string) => void;
  onSendOTP: () => void;
  isLoading?: boolean;
  isSendingOTP?: boolean;
}

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

  const handleSendOTP = () => {
    if (!newPhone || newPhone.length < 10) {
      return;
    }
    setOtpSent(true);
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
    onOpenChange(false);
  };

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

          {/* OTP Input */}
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              OTP
            </Label>
            <div className="flex gap-2">
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading || !otpSent}
                className="text-sm flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendOTP}
                disabled={isLoading || isSendingOTP || !newPhone || otpSent}
                className="whitespace-nowrap"
              >
                {isSendingOTP ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default ChangePhoneDialog;
