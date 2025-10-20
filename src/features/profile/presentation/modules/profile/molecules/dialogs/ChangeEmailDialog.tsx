'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useState } from 'react';

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail?: string;
  onConfirm: (newEmail: string, otp: string) => void;
  onSendOTP: () => void;
  isLoading?: boolean;
  isSendingOTP?: boolean;
}

export const ChangeEmailDialog: FC<ChangeEmailDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onSendOTP,
  isLoading = false,
  isSendingOTP = false,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (!newEmail || !newEmail.includes('@')) {
      return;
    }
    setOtpSent(true);
    onSendOTP();
  };

  const handleConfirm = () => {
    if (!newEmail || !otp) return;
    onConfirm(newEmail, otp);
  };

  const handleClose = () => {
    setNewEmail('');
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
      title="Change email"
      description="Enter your new email address and verify it with the OTP code that will be sent to you."
      variant="warning"
      type="info"
      hideCancel={true}
      hideConfirm={true}
      isLoading={isLoading}
      renderContent={() => (
        <div className="space-y-4">
          {/* New Email Input */}
          <div className="space-y-2">
            <Label htmlFor="new-email" className="text-sm font-medium text-gray-700">
              New Email
            </Label>
            <Input
              id="new-email"
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
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
                disabled={isLoading || isSendingOTP || !newEmail || otpSent}
                className="whitespace-nowrap"
              >
                {isSendingOTP ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          </div>
        </div>
      )}
      footer={
        <DefaultSubmitButton
          onBack={handleClose}
          onSubmit={handleConfirm}
          isSubmitting={isLoading}
          disabled={!newEmail || !otp}
          backTooltip="Cancel"
          submitTooltip="Confirm email change"
          className="mt-0"
        />
      }
    />
  );
};

export default ChangeEmailDialog;
