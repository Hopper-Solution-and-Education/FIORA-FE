import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DepositRequestStatus } from '../../domain/enum';
import { WALLET_SETTING_STATUS_OPTIONS } from '@/features/setting/constants';

interface WalletSettingStatusBadgeProps {
  status: DepositRequestStatus;
  className?: string;
}

const WalletSettingStatusBadge: React.FC<WalletSettingStatusBadgeProps> = ({
  status,
  className,
}) => {
  const statusOption = WALLET_SETTING_STATUS_OPTIONS.find((option) => option.value === status);

  if (!statusOption) {
    return null;
  }

  return (
    <Badge variant="secondary" className={`${statusOption.color} ${className || ''}`}>
      {statusOption.label}
    </Badge>
  );
};

export default WalletSettingStatusBadge;
