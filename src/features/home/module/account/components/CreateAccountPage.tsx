'use client';

import IconSelect from '@/components/common/IconSelect';
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
import { setAccountDialogOpen, setRefresh } from '@/features/home/module/account/slices';
import { createAccount } from '@/features/home/module/account/slices/actions';
import { Account } from '@/features/home/module/account/slices/types';
import {
  defaultNewAccountValues,
  NewAccountDefaultValues,
  validateNewAccountSchema,
} from '@/features/home/module/account/slices/types/formSchema';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function CreateAccountModal({ title }: { title?: string }) {
  const dispatch = useAppDispatch();
  const { accountCreateDialog, parentAccounts, refresh } = useAppSelector((state) => state.account);
  const [availableLimit, setAvailableLimit] = useState<number>(0);

  const form = useForm<NewAccountDefaultValues>({
    resolver: yupResolver(validateNewAccountSchema),
    defaultValues: defaultNewAccountValues,
  });

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

  const onSubmit = async (data: NewAccountDefaultValues) => {
    try {
      const finalData: NewAccountDefaultValues = {
        ...data,
        balance:
          data.type === ACCOUNT_TYPES.CREDIT_CARD && data.balance
            ? -Math.abs(Number(data.balance))
            : data.balance || 0,
        limit: data.limit ? Number(data.limit) : undefined,
        parentId: data.parentId || undefined,
      };
      await dispatch(createAccount(finalData));
      dispatch(setRefresh(!refresh));
      dispatch(setAccountDialogOpen(false));
      toast.success('Account created successfully');
      form.reset();
    } catch (error) {
      console.error('Error create account:', error);
      toast.error('Failed to create account');
    }
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

  // Add isTypeDisabled to the form default values if not already present
  const isTypeDisabled = form.watch('isTypeDisabled') || false;

  // * COMPONENT BEHAVIOR ZONE *
  const handleCloseDialog = (e: boolean) => {
    dispatch(setAccountDialogOpen(e));
    form.reset();
  };

  return (
    <Dialog open={accountCreateDialog} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{title || 'Create New Account'}</DialogTitle>
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

            {/* Parent Account*/}
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
                          parentAccounts.data.map((account: Account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} ({account.type})
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

        <DialogFooter className="bg-muted/50 px-6 py-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => dispatch(setAccountDialogOpen(false))}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
