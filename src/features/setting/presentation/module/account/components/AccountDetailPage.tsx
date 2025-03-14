'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

// Define account types
const ACCOUNT_TYPES = {
  PAYMENT: 'Payment Account',
  SAVING: 'Saving Account',
  CREDIT_CARD: 'Credit Card',
  DEBT: 'Debt Account',
  LENDING: 'Lending Account',
};

interface ViewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountData: {
    icon?: string;
    type: string;
    name: string;
    currency: string;
    limit?: string;
    balance: string;
    parent?: string;
  };
  onDelete: () => void;
}

export function ViewAccountModal({
  isOpen,
  onClose,
  accountData,
  onDelete,
}: ViewAccountModalProps) {
  const isCreditCard = accountData.type === ACCOUNT_TYPES.CREDIT_CARD;
  const isNegativeBalance = parseFloat(accountData.balance) < 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Account Details</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon<span className="text-red-500">*</span>
            </Label>
            <div className="border rounded w-full h-10 flex items-center px-2 bg-muted/50">
              {accountData.icon ? (
                <Image
                  src={accountData.icon || '/placeholder.svg'}
                  alt="Icon"
                  className="h-6 w-6"
                />
              ) : (
                <div className="h-6 w-6 bg-muted rounded flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type<span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Select disabled value={accountData.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ACCOUNT_TYPES.PAYMENT}>{ACCOUNT_TYPES.PAYMENT}</SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.SAVING}>{ACCOUNT_TYPES.SAVING}</SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.CREDIT_CARD}>
                    {ACCOUNT_TYPES.CREDIT_CARD}
                  </SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.DEBT}>{ACCOUNT_TYPES.DEBT}</SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.LENDING}>{ACCOUNT_TYPES.LENDING}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input id="name" value={accountData.name} disabled />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="currency" className="text-right">
              Currency<span className="text-red-500">*</span>
            </Label>
            <Select disabled value={accountData.currency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="($) USD">($) USD</SelectItem>
                <SelectItem value="(đ)">(đ) VND</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCreditCard && accountData.limit && (
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="limit" className="text-right">
                Credit Limit
              </Label>
              <div className="flex items-center gap-2">
                <Input id="limit" value={accountData.limit} disabled />
                {accountData.balance && (
                  <Badge variant="outline" className="whitespace-nowrap">
                    Available:{' '}
                    {(parseFloat(accountData.limit) + parseFloat(accountData.balance)).toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="balance" className="text-right">
              Balance
            </Label>
            <Input
              id="balance"
              value={accountData.balance}
              className={cn(isNegativeBalance && 'text-red-500')}
              disabled
            />
          </div>

          {accountData.parent && (
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="parent" className="text-right">
                Parent
              </Label>
              <Input id="parent" value={accountData.parent} disabled />
            </div>
          )}
        </div>

        <DialogFooter className="bg-muted/50 px-6 py-4">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
