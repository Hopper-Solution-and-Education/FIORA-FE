'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CreditCard, HelpCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { BankAccount } from '../../../../schema/personalInfoSchema';

interface BankAccountDetailsFormProps {
  form: UseFormReturn<BankAccount>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const BankAccountDetailsForm: React.FC<BankAccountDetailsFormProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-base sm:text-lg">Account Details</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Your bank information is encrypted and secured. We use this information only for
                verification and transaction purposes.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="swift-code" className="text-sm font-medium">
              SWIFT Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="swift-code"
              placeholder="Enter your SWIFT code"
              {...register('SWIFT', { required: 'SWIFT code is required' })}
              disabled={isSubmitting || isLoadingData || disabled}
            />
            {errors.SWIFT && <p className="text-sm text-red-500">{errors.SWIFT.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank-name" className="text-sm font-medium">
              Bank Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bank-name"
              placeholder="Enter your bank name"
              {...register('bankName', { required: 'Bank name is required' })}
              disabled={isSubmitting || isLoadingData || disabled}
            />
            {errors.bankName && <p className="text-sm text-red-500">{errors.bankName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="account-number" className="text-sm font-medium">
              Bank Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account-number"
              placeholder="Enter your account number"
              {...register('accountNumber', { required: 'Account number is required' })}
              disabled={isSubmitting || isLoadingData || disabled}
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500">{errors.accountNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-name" className="text-sm font-medium">
              Bank Account Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account-name"
              placeholder="Enter account holder name"
              {...register('accountName', { required: 'Account name is required' })}
              disabled={isSubmitting || isLoadingData || disabled}
            />
            {errors.accountName && (
              <p className="text-sm text-red-500">{errors.accountName.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankAccountDetailsForm;
