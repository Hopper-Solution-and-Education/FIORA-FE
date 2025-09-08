'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BankAccountFormData } from '@/features/profile/domain/entities/models/profile';
import { FormField } from '@/features/profile/presentation/modules/eKyc/shared/components';
import { CreditCard, HelpCircle } from 'lucide-react';

interface BankAccountDetailsFormProps {
  formData: BankAccountFormData;
  onInputChange: (field: keyof BankAccountFormData, value: string) => void;
  isLoading?: boolean;
}

const BankAccountDetailsForm: React.FC<BankAccountDetailsFormProps> = ({
  formData,
  onInputChange,
  isLoading = false,
}) => {
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
          <FormField
            id="account-holder"
            label="Swift Code"
            placeholder="Enter your swift code"
            value={formData.SWIFT}
            onChange={(e) => onInputChange('SWIFT', e.target.value)}
            disabled={isLoading}
            required
          />

          <FormField
            id="bank-name"
            label="Bank Name"
            placeholder="Enter your bank name"
            value={formData.bankName}
            onChange={(e) => onInputChange('bankName', e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            id="account-number"
            label="Bank Account Number"
            type="password"
            placeholder="Enter your account number"
            value={formData.accountNumber}
            onChange={(e) => onInputChange('accountNumber', e.target.value)}
            disabled={isLoading}
            required
          />

          <FormField
            id="routing-number"
            label="Bank Account Name"
            placeholder="Enter routing/sort code"
            value={formData.accountName}
            onChange={(e) => onInputChange('accountName', e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankAccountDetailsForm;
