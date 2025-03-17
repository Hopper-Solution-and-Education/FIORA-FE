'use client';

import type React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  ACCOUNT_ICONS,
  ACCOUNT_TYPES,
} from '@/features/setting/presentation/module/account/mockData';
import { cn } from '@/shared/utils';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Account, AccountType, Currency } from './type';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EditAccountDialogProps {
  account: Account | null;
  allAccounts: Account[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: Account) => void;
}

export const EditAccountDialog = ({
  account,
  isOpen,
  onClose,
  allAccounts,
  onSubmit,
}: EditAccountDialogProps) => {
  const [formData, setFormData] = useState({
    icon: '',
    type: ACCOUNT_TYPES.PAYMENT,
    name: '',
    currency: 'VND',
    limit: '',
    available_limit: '',
    balance: '',
    parentId: '',
    isParentSelected: false,
    parent: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [subAccountToRemove, setSubAccountToRemove] = useState<{
    parentId: string;
    accountId: string;
  } | null>(null);

  // Get the selected icon component
  const getSelectedIcon = () => {
    const selectedIcon = ACCOUNT_ICONS.find((icon) => icon.id === formData.icon);
    if (selectedIcon) {
      const IconComponent = selectedIcon.icon;
      return <IconComponent className="h-6 w-6" />;
    }
    return null;
  };

  const getParentAccount = (id: string) => {
    return allAccounts.find((account) => account.id === id);
  };

  useEffect(() => {
    if (account) {
      setFormData({
        icon: account?.icon || '',
        type: account.type,
        name: account.name,
        currency: account.currency,
        limit: account.limit ? Number(account.limit).toFixed(2) : '',
        balance: account.balance ? Number(account.balance).toFixed(2) : '',
        parentId: account.parentId || '',
        isParentSelected: !!account.parentId,
        available_limit: '',
        parent: '',
      });

      // check if account has parent
      if (account.parentId) {
        const parentAccount = getParentAccount(account.parentId);
        if (parentAccount) {
          setFormData((prev) => ({
            ...prev,
            parent: parentAccount.name,
          }));
        }
      }
    }
  }, [account, allAccounts]);

  if (!account) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onSubmit(account);
  };

  const handleChange = (field: string, value: string) => {
    // For parent field, use the special handler
    if (field === 'parent') {
      handleParentChange(value);
      return;
    }

    // For type field, use the special handler
    if (field === 'type') {
      handleTypeChange(value);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleParentChange = (parentId: string) => {
    if (!parentId) {
      setFormData((prev) => ({ ...prev, parentId: '', isParentSelected: false }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      parentId: parentId,
      isParentSelected: true,
    }));

    // Clear any parent-related errors
    if (errors.parentId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.parentId;
        return newErrors;
      });
    }
  };

  // Handle type change
  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      type,
      parent: '', // Reset parent when type changes
    }));

    // Clear any type-related errors
    if (errors.type) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.type;
        return newErrors;
      });
    }
  };

  const handleRemoveAPI = async (parentId: string, subAccountId: string) => {
    try {
      const response = await fetch('/api/accounts/create', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId, subAccountId }),
      });

      const data = await response.json();

      if (data.status !== 201) {
        alert('Error removing sub-account');
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleRemoveClick = (accountId: string, parentId: string) => {
    setSubAccountToRemove({ accountId, parentId });
    setIsConfirmOpen(true);
  };

  // Function to confirm removal
  const confirmRemove = async () => {
    if (subAccountToRemove) {
      const { parentId, accountId } = subAccountToRemove;

      const removedRes = await handleRemoveAPI(parentId, accountId);
      if (!removedRes) {
        alert('Error removing sub-account');
        return;
      }

      setIsConfirmOpen(false);
      setSubAccountToRemove(null);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Make changes to the account here. Click submit when you are done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Icon */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon*
                </Label>
                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn('w-full justify-between')}
                      >
                        <div className="flex items-center gap-2">
                          {formData.icon ? (
                            <>
                              <div className="flex items-center justify-center h-6 w-6 rounded bg-muted">
                                {getSelectedIcon()}
                              </div>
                              <span>
                                {ACCOUNT_ICONS.find((icon) => icon.id === formData.icon)?.name ||
                                  'Select icon'}
                              </span>
                            </>
                          ) : (
                            <span>Select icon</span>
                          )}
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                  {/* {errors.icon && <p className="text-xs text-red-500">{errors.icon}</p>} */}
                </div>
              </div>

              {/* Type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type*
                </Label>
                <Select defaultValue={formData.type} disabled>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AccountType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  id="name"
                  defaultValue={formData.name}
                  className={cn('col-span-3', errors.name && 'border-red-500')}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              {/* Currency */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency*
                </Label>
                <Select
                  defaultValue={formData.currency}
                  onValueChange={(value) => handleChange('currency', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Currency).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency === Currency.USD ? '($) USD' : '(₫) VND'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type === ACCOUNT_TYPES.CREDIT_CARD && (
                <>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <Label htmlFor="available_limit" className="text-right">
                      Available Limit
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="available_limit"
                        value={formData.available_limit}
                        readOnly
                        placeholder="0.00"
                        className={cn(
                          'bg-gray-100 cursor-not-allowed',
                          errors.available_limit && 'border-red-500',
                          Number.parseFloat(formData.available_limit) < 0 && 'text-red-500',
                        )}
                      />
                      {errors.available_limit && (
                        <p className="text-xs text-red-500">{errors.available_limit}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <Label htmlFor="limit" className="text-right">
                      Credit Limit
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="limit"
                        value={formData.limit}
                        onChange={(e) => handleChange('limit', e.target.value)}
                        placeholder="0.00"
                        className={errors.limit ? 'border-red-500' : ''}
                      />
                      {errors.limit && <p className="text-xs text-red-500">{errors.limit}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* Balance */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                  Balance
                </Label>
                <Input
                  id="balance"
                  type="number"
                  defaultValue={formData.balance}
                  onChange={(e) => handleChange('balance', e.target.value)}
                  className={cn(
                    'col-span-3',
                    errors.balance && 'border-red-500',
                    formData.balance?.startsWith('-') && 'text-red-500',
                  )}
                />
                {errors.balance && <p className="text-xs text-red-500">{errors.balance}</p>}
              </div>

              {/* Parent */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <Label htmlFor="parent" className="text-right">
                  Parent
                </Label>
                <div className="space-y-2">
                  <Input
                    id="parent"
                    value={formData.parent}
                    readOnly
                    placeholder="Select parent"
                    className={cn(
                      'bg-gray-100 cursor-not-allowed',
                      errors.parent && 'border-red-500',
                      formData.isParentSelected && 'text-green-500',
                    )}
                  ></Input>
                </div>
              </div>

              {/* Error alert */}
              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fix the errors before submitting the form.
                  </AlertDescription>
                </Alert>
              )}

              {/* Create and options */}
              {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Create and</Label>
              <RadioGroup defaultValue="do-nothing" className="col-span-3 flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="do-nothing" id="do-nothing" />
                  <Label htmlFor="do-nothing">Do nothing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="copy" id="copy" />
                  <Label htmlFor="copy">Copy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">New</Label>
                </div>
              </RadioGroup>
            </div> */}
            </div>
            <DialogFooter className="mt-5 flex w-full">
              <div className="flex gap-3 items-center justify-between w-full">
                <div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveClick(account.id, account.parentId || '');
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the sub-account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
