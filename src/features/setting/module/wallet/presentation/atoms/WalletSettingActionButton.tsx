import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import React from 'react';
import { DepositRequestStatus } from '../../domain';
import { useAppDispatch } from '@/store';
import { updateDepositRequestStatusAsyncThunk } from '../../slices/actions';
import { toast } from 'sonner';

interface WalletSettingActionButtonProps {
  status: DepositRequestStatus;
  id: string;
  className?: string;
}

const WalletSettingActionButton = ({ status, id, className }: WalletSettingActionButtonProps) => {
  const dispatch = useAppDispatch();
  const isRequested = status === DepositRequestStatus.Requested;

  const handleUpdateStatus = async (newStatus: DepositRequestStatus) => {
    try {
      await dispatch(updateDepositRequestStatusAsyncThunk({ id, status: newStatus })).unwrap();
      toast.success(
        `Request has been ${newStatus === DepositRequestStatus.Approved ? 'approved' : 'rejected'}.`,
      );
    } catch (error: any) {
      toast.error(error?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className || ''}`}>
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleUpdateStatus(DepositRequestStatus.Rejected)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={!isRequested}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          disabled={!isRequested}
        >
          <Check className="h-4 w-4" />
        </Button>
      </>
    </div>
  );
};

export default WalletSettingActionButton;
