import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Account, formatCurrency } from './type';

interface AccountDetailDialogProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDetailDialog = ({ account, isOpen, onClose }: AccountDetailDialogProps) => {
  if (!account) return null;

  const createdAt =
    typeof account.createdAt === 'string' ? new Date(account.createdAt) : account.createdAt;
  const updatedAt =
    typeof account.updatedAt === 'string' ? new Date(account.updatedAt) : account.updatedAt;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{account.name}</DialogTitle>
          <DialogDescription>Account details and information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Balance:</span>
            <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(account.balance, account.currency)}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Type:</span>
            <span>{account.type}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Currency:</span>
            <span>{account.currency}</span>
          </div>
          {account.limit !== undefined && (
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Limit:</span>
              <span>{formatCurrency(account.limit, account.currency)}</span>
            </div>
          )}
          {account.description && (
            <div className="grid grid-cols-1 gap-2">
              <span className="font-medium">Description:</span>
              <p className="text-sm text-gray-500">{account.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Created:</span>
            <span>{createdAt.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Last Updated:</span>
            <span>{updatedAt.toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
