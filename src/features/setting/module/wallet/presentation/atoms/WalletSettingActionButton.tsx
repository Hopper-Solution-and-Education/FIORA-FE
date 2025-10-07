import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { ATTACHMENT_CONSTANTS } from '@/features/setting/data/module/attachment/constants/attachmentConstants';
import { cn } from '@/lib/utils';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { toast } from 'sonner';
import { DepositRequestStatus, FXRequestType } from '../../domain';
import { updateDepositRequestStatusAsyncThunk } from '../../slices/actions/updateDepositRequestStatusAsynThunk';
import { useDispatchTableContext, useTableContext } from '../hooks';
import ApproveConfirmationDialog from './ApproveConfirmationDialog';
import RejectDepositRequestDialog from './RejectDepositRequestDialog';

interface WalletSettingActionButtonProps {
  status: DepositRequestStatus;
  type: FXRequestType;
  id: string;
  className?: string;
}

const WalletSettingActionButton = ({
  status,
  type,
  id,
  className,
}: WalletSettingActionButtonProps) => {
  const isRequested = status === DepositRequestStatus.Requested;
  const isUpdating = useAppSelector((state) => state.walletSetting.updatingItems.includes(id));
  const isDisabled = !isRequested || isUpdating;

  const { dispatchTable, reloadData } = useDispatchTableContext();
  const { table } = useTableContext();
  const dispatch = useAppDispatch();

  const handleToggleRejectModal = () =>
    dispatchTable({ type: 'TOGGLE_REJECT_MODAL', payload: { open: !table.showRejectModal, id } });

  const handleToggleApproveModal = () =>
    dispatchTable({ type: 'TOGGLE_APPROVE_MODAL', payload: { open: !table.showApproveModal, id } });

  const handleApprove = async (attachments?: File[]) => {
    try {
      if (type === FXRequestType.Withdraw && attachments && attachments.length > 0) {
        const file = attachments[0];

        // Upload file to Firebase Storage first
        const fileName = `withdraw-attachment-${Date.now()}-${file.name}`;
        const firebaseUrl = await uploadToFirebase({
          file,
          path: 'wallet-attachments',
          fileName,
        });

        // Extract file path from Firebase URL for path field
        const urlParts = firebaseUrl.split('/');
        const fileNameFromUrl = urlParts[urlParts.length - 1].split('?')[0];
        const filePath = `wallet-attachments/${fileNameFromUrl}`;

        const attachmentData = {
          type: file.type.startsWith('image/')
            ? ATTACHMENT_CONSTANTS.TYPES.IMAGE
            : ATTACHMENT_CONSTANTS.TYPES.DOCUMENT,
          size: file.size,
          url: firebaseUrl,
          path: filePath,
        };

        await dispatch(
          updateDepositRequestStatusAsyncThunk({
            id,
            status: DepositRequestStatus.Approved,
            attachmentData,
          }),
        ).unwrap();
      } else {
        await dispatch(
          updateDepositRequestStatusAsyncThunk({ id, status: DepositRequestStatus.Approved }),
        ).unwrap();
      }

      // Reload table data to reflect the updated status
      await reloadData();

      handleToggleApproveModal();

      toast.success('Request Approved Success', {
        description: 'Request approved, wallet updated',
      });
    } catch (e: any) {
      console.error(e?.message);
      toast.error('Request Approved Failed', {
        description: e?.message || 'Failed. Try again or contact support.',
      });
    }
  };

  const handleRejectConfirm = async (remark: string) => {
    try {
      await dispatch(
        updateDepositRequestStatusAsyncThunk({ id, status: DepositRequestStatus.Rejected, remark }),
      ).unwrap();

      // Reload table data to reflect the updated status
      await reloadData();

      handleToggleRejectModal();

      toast.success('Request Rejected Success', {
        description: 'Request rejected, wallet updated',
      });
    } catch (e: any) {
      console.error(e?.message);
      toast.error('Request Rejected Failed', {
        description: 'Failed. Try again or contact support.',
      });
    }
  };

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
        onClick={handleToggleRejectModal}
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
        onClick={handleToggleApproveModal}
        className={cn('h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50')}
        disabled={isDisabled}
      >
        {isUpdating ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.check className="h-4 w-4" />
        )}
      </Button>

      <ApproveConfirmationDialog
        open={table.approvingId === id && !!table.showApproveModal}
        onClose={handleToggleApproveModal}
        onConfirm={handleApprove}
        isUpdating={isUpdating}
        requestType={type === FXRequestType.Withdraw ? 'Withdraw' : 'Deposit'}
      />

      <RejectDepositRequestDialog
        open={table.rejectingId === id && !!table.showRejectModal}
        onClose={handleToggleRejectModal}
        onConfirm={handleRejectConfirm}
        isUpdating={isUpdating}
        requestType={type === FXRequestType.Withdraw ? 'Withdraw' : 'Deposit'}
      />
    </div>
  );
};

export default WalletSettingActionButton;
