import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store';
import { cn } from '@/lib/utils';
import { DepositRequestStatus } from '../../domain';
import { useWalletSettingContext } from '../hooks';

interface WalletSettingActionButtonProps {
  status: DepositRequestStatus;
  id: string;
  className?: string;
}

const WalletSettingActionButton = ({ status, id, className }: WalletSettingActionButtonProps) => {
  const isRequested = status === DepositRequestStatus.Requested;
  const isUpdating = useAppSelector((state) => state.walletSetting.updatingItems.includes(id));
  const isDisabled = !isRequested || isUpdating;

  const { handleUpdateStatus } = useWalletSettingContext();

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2',
        isDisabled && 'cursor-not-allowed',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleUpdateStatus(id, DepositRequestStatus.Rejected)}
        className={cn('h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50')}
        disabled={isDisabled}
      >
        {isUpdating ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.close className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleUpdateStatus(id, DepositRequestStatus.Approved)}
        className={cn('h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50')}
        disabled={isDisabled}
      >
        {isUpdating ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.check className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default WalletSettingActionButton;
