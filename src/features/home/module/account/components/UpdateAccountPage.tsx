'use client';

import IconSelect from '@/components/common/atoms/IconSelect';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
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
  setAccountDeleteDialog,
  setAccountUpdateDialog,
  setRefresh,
  setSelectedAccount,
} from '@/features/home/module/account/slices';
import { updateAccount } from '@/features/home/module/account/slices/actions';
import { Account } from '@/features/home/module/account/slices/types';
import {
  defaultNewAccountValues,
  UpdateAccountDefaultValues,
  validateNewAccountSchema,
} from '@/features/home/module/account/slices/types/formSchema';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function UpdateAccountModal() {
  const dispatch = useAppDispatch();
  const { accounts, accountUpdateDialog, parentAccounts, selectedAccount, refresh } =
    useAppSelector((state) => state.account);
  const [availableLimit, setAvailableLimit] = useState<number>(0);

  const form = useForm<UpdateAccountDefaultValues>({
    resolver: yupResolver(validateNewAccountSchema),
    defaultValues: defaultNewAccountValues,
  });

  // Pre-fill form with account data when account prop changes
  useEffect(() => {
    if (selectedAccount) {
      const balanceToDisplay =
        selectedAccount.type === ACCOUNT_TYPES.CREDIT_CARD
          ? -selectedAccount.balance
          : selectedAccount.balance;
      form.reset({
        icon: selectedAccount.icon || defaultNewAccountValues.icon,
        type: selectedAccount.type || defaultNewAccountValues.type,
        name: selectedAccount.name || defaultNewAccountValues.name,
        currency: selectedAccount.currency || defaultNewAccountValues.currency,
        limit: selectedAccount.limit || defaultNewAccountValues.limit,
        balance: balanceToDisplay || defaultNewAccountValues.balance,
        parentId: selectedAccount.parentId || null || defaultNewAccountValues.parentId,
        isTypeDisabled: !!selectedAccount.parentId || defaultNewAccountValues.isTypeDisabled,
      });
    }
  }, [selectedAccount, form]);

  // * FORM HANDLING ZONE *
  const calculateAvailableLimit = (limit: number | undefined, balance: number | undefined) => {
    const limitNum = limit || 0;
    const balanceNum = balance || 0;
    return limitNum - balanceNum;
  };

  // Update available limit when values change
  useEffect(() => {
    if (form.getValues('type') === ACCOUNT_TYPES.CREDIT_CARD) {
      const newAvailableLimit = calculateAvailableLimit(
        form.getValues('limit') || 0,
        form.getValues('balance'),
      );
      setAvailableLimit(newAvailableLimit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('limit'), form.watch('balance'), form.watch('type')]);

  const onSubmit = async (data: UpdateAccountDefaultValues) => {
    if (!selectedAccount?.id) return;

    try {
      // * Prepare data for update
      const finalData: Partial<UpdateAccountDefaultValues> = {
        ...data,
        balance:
          data.type === ACCOUNT_TYPES.CREDIT_CARD && data.balance
            ? -Math.abs(Number(data.balance))
            : data.balance || 0,
        limit: data.limit ? Number(data.limit) : undefined,
        parentId: data.parentId || undefined,
      };

      // * Dispatch update action
      const response = await dispatch(
        updateAccount({ id: selectedAccount.id, data: finalData }),
      ).unwrap();
      if (response) {
        dispatch(setRefresh(!refresh));
        dispatch(setSelectedAccount(null));
        dispatch(setAccountUpdateDialog(false));
      }

      toast.success('Account updated successfully!');
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount?.id) return;
    dispatch(setAccountDeleteDialog(true));
  };

  const handleChangeParentAccount = (value: string | null, field: any) => {
    if (value && value !== 'null') {
      const selectedParent = parentAccounts.data?.find((p: Account) => p.id === value);
      if (selectedParent) {
        form.setValue('type', selectedParent.type);
        form.setValue('isTypeDisabled', true);
      }
    } else {
      form.setValue('type', 'null');
      form.setValue('isTypeDisabled', false);
    }
    field.onChange(value === 'null' ? null : value);
  };

  const isTypeDisabled = form.watch('isTypeDisabled') || false;

  // * COMPONENT BEHAVIOR ZONE *
  const handleCloseDialog = (open: boolean) => {
    dispatch(setAccountUpdateDialog(open));
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={accountUpdateDialog} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Update Account</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            {/* Icon */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon<span className="text-red-500">*</span>
              </Label>
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <IconSelect selectedIcon={field.value} onIconChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Type */}
            <div className="grid grid-cols-[120px_1fr] items-start gap-4">
              <Label htmlFor="type" className="text-right pt-2">
                Type<span className="text-red-500">*</span>
              </Label>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isTypeDisabled}
                    >
                      <FormControl>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ACCOUNT_TYPES).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name<span className="text-red-500">*</span>
              </Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input id="name" placeholder="Enter account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Currency */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency<span className="text-red-500">*</span>
              </Label>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VND">(đ) VND</SelectItem>
                        <SelectItem value="USD">($) USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Credit Card Fields */}
            {form.getValues('type') === ACCOUNT_TYPES.CREDIT_CARD && (
              <>
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <Label htmlFor="limit" className="text-right">
                    Credit Limit<span className="text-red-500">*</span>
                  </Label>
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="limit"
                            type="number"
                            placeholder="0.00"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <Label className="text-right">Available Limit</Label>
                  <Input
                    value={availableLimit.toFixed(2)}
                    readOnly
                    className={cn('cursor-not-allowed', availableLimit < 0 && 'text-red-500')}
                  />
                </div>
              </>
            )}

            {/* Balance */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                {form.getValues('type') === ACCOUNT_TYPES.CREDIT_CARD
                  ? 'Current Balance'
                  : 'Balance'}
              </Label>
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="balance"
                        type="number"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Parent Account */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="parentId" className="text-right">
                Parent
              </Label>
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => handleChangeParentAccount(value, field)}
                      value={field.value || 'null'}
                    >
                      <FormControl>
                        <SelectTrigger id="parentId">
                          <SelectValue placeholder="Select parent account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        {parentAccounts.data &&
                          selectedAccount &&
                          parentAccounts.data
                            .filter((acc) => acc.id !== selectedAccount.id)
                            .map((acc: Account) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.name} ({acc.type})
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter className="flex-row justify-between md:justify-between">
          <div>
            <Button
              variant="ghost"
              type="button"
              onClick={handleDelete}
              disabled={accounts.isLoading}
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => handleCloseDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.formState.isValid || accounts.isLoading}>
              {accounts.isLoading && <Icons.spinner className="animate-spin mr-2" />}
              Update
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
