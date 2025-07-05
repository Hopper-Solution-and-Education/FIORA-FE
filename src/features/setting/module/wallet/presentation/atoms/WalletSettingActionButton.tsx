import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check, X } from 'lucide-react';
import { DepositRequestStatus } from '../../domain/enum';

interface WalletSettingActionButtonProps {
  status: DepositRequestStatus;
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

const WalletSettingActionButton: React.FC<WalletSettingActionButtonProps> = ({
  status,
  onView,
  onApprove,
  onReject,
  className,
}) => {
  const isRequested = status === DepositRequestStatus.Requested;

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Button variant="ghost" size="sm" onClick={onView} className="h-8 w-8 p-0">
        <Eye className="h-4 w-4" />
      </Button>

      {isRequested && onApprove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onApprove}
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}

      {isRequested && onReject && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReject}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default WalletSettingActionButton;
