'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useState } from 'react';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (otp: string) => void;
  onSendOTP: () => void;
  isLoading?: boolean;
  isSendingOTP?: boolean;
}

export const DeleteAccountDialog: FC<DeleteAccountDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onSendOTP,
  isLoading = false,
  isSendingOTP = false,
}) => {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    setOtpSent(true);
    onSendOTP();
  };

  const handleConfirm = () => {
    if (!otp) return;
    onConfirm(otp);
  };

  const handleClose = () => {
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
      title="Delete account"
      description="Enter the OTP to confirm permanent account deletion. This action cannot be undone."
      variant="danger"
      type="danger"
      hideCancel={true}
      hideConfirm={true}
      isLoading={isLoading}
      renderContent={() => (
        <div className="space-y-4">
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
                disabled={isLoading || isSendingOTP || otpSent}
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
          disabled={!otp}
          backTooltip="Cancel"
          submitTooltip="Confirm account deletion"
          className="mt-0"
        />
      }
    />
  );
};

export default DeleteAccountDialog;
