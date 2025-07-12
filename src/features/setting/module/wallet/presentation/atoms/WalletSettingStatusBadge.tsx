import { Badge } from '@/components/ui/badge';
import { WALLET_SETTING_STATUS_OPTIONS } from '../../data';
import { DepositRequestStatus } from '../../domain';

interface WalletSettingStatusBadgeProps {
  status: DepositRequestStatus;
  className?: string;
}

const WalletSettingStatusBadge = ({ status, className }: WalletSettingStatusBadgeProps) => {
  const statusOption = WALLET_SETTING_STATUS_OPTIONS.find((option) => option.value === status);

  if (!statusOption) {
    return null;
  }

  return (
    <Badge
      variant="secondary"
      className={`hover:bg-${statusOption.color}  ${statusOption.color} ${className || ''}`}
    >
      {statusOption.label}
    </Badge>
  );
};

export default WalletSettingStatusBadge;
