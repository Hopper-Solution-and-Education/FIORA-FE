'use client';

import { Button } from '@/components/ui/button';
import { STATUS_COLOR } from '@/features/profile/constant';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { cn } from '@/shared/utils';
import { RefreshCcw, Shield } from 'lucide-react';
import { FC } from 'react';

interface KYCActionButtonProps {
  status?: EKYCStatus;
  onClick: () => void;
}

export const KYCActionButton: FC<KYCActionButtonProps> = ({ status, onClick }) => {
  if (status === EKYCStatus.PENDING) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        type="button"
        className={cn(
          STATUS_COLOR[EKYCStatus.PENDING].color,
          STATUS_COLOR[EKYCStatus.PENDING].hoverColor,
          STATUS_COLOR[EKYCStatus.PENDING].textColor,
        )}
      >
        Pending
      </Button>
    );
  }

  if (status === EKYCStatus.APPROVAL) {
    return null;
  }

  if (status === EKYCStatus.REJECTED) {
    return (
      <Button variant="outline" size="sm" onClick={onClick} type="button" className="w-10 h-10">
        <RefreshCcw />
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        'w-10 h-10 p-2 rounded cursor-pointer',
        STATUS_COLOR[EKYCStatus.PENDING].color,
        STATUS_COLOR[EKYCStatus.PENDING].hoverColor,
      )}
      variant="outline"
      size="sm"
      type="button"
      onClick={onClick}
    >
      <Shield />
    </Button>
  );
};

export default KYCActionButton;
