'use client';

import IconSelect from '@/components/common/IconSelect'; // Assuming this exists
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
import { setAccountDialogOpen } from '@/features/home/module/account/slices';
import { createAccount } from '@/features/home/module/account/slices/actions';
import {
  defaultNewAccountValues,
  NewAccountDefaultValues,
  validateNewAccountSchema,
} from '@/features/home/module/account/slices/types/formSchema';
import { ACCOUNT_ICONS, ACCOUNT_TYPES } from '@/shared/constants/account';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function CreateAccountModal({ title }: { title?: string }) {
  const dispatch = useAppDispatch();
  const { accountCreateDialog, parentAccounts } = useAppSelector((state) => state.account);

  // Initialize the form with react-hook-form
  const form = useForm<NewAccountDefaultValues>({
    resolver: yupResolver(validateNewAccountSchema),
    defaultValues: defaultNewAccountValues,
  });

  // Watch the type field to filter icons dynamically
  const type = form.watch('type');
  const availableIcons = ACCOUNT_ICONS.filter((icon) => icon.types.includes(type));

  // Reset icon if it’s invalid for the new type
  useEffect(() => {
    const currentIcon = form.getValues('icon');
    if (currentIcon && !availableIcons.some((icon) => icon.id === currentIcon)) {
      form.setValue('icon', availableIcons[0]?.id || '');
    }
  }, [type, availableIcons, form]);

  // Form submission handler
  const onSubmit = (data: NewAccountDefaultValues) => {
    const finalData: NewAccountDefaultValues = {
      ...data,
      balance: data.balance ? data.balance : 0,
      limit: data.limit ? data.limit : undefined,
      parentId: data.parentId || undefined,
    };
    dispatch(createAccount(finalData));
    dispatch(setAccountDialogOpen(false));
    toast.success('Account created successfully');
  };

  // Calculate available limit for credit cards
  const limit = form.watch('limit');
  const balance = form.watch('balance');
  let availableLimit = '';
  if (type === ACCOUNT_TYPES.CREDIT_CARD && limit && balance) {
    const limitNum = limit || 0;
    const balanceNum = balance || 0;
    availableLimit = (limitNum + balanceNum).toFixed(2); // Balance may be negative
  }

  return (
    <Dialog
      open={accountCreateDialog}
      onOpenChange={(open) => dispatch(setAccountDialogOpen(open))}
    >
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
            {type === ACCOUNT_TYPES.CREDIT_CARD && (
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
                    value={availableLimit}
                    readOnly
                    className={cn(
                      'bg-gray-100 cursor-not-allowed',
                      Number.parseFloat(availableLimit) < 0 && 'text-red-500',
                    )}
                  />
                </div>
              </>
            )}

            {/* Balance */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance
              </Label>
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input id="balance" type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Parent */}
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value) {
                          const selectedParent = parentAccounts.data?.find((p) => p.id === value);
                          if (selectedParent) {
                            form.setValue('type', selectedParent.type);
                          }
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger id="parentId">
                          <SelectValue placeholder="Select parent account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parentAccounts.data?.map((account) => (
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
