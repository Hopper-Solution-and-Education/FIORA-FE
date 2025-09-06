'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FormField } from '@/features/profile/shared/components';
import { Building2, CreditCard, FileText, HelpCircle } from 'lucide-react';

interface BankAccountFormData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
}

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
            label="Account Holder Name"
            placeholder="Enter full name as on bank account"
            value={formData.accountHolderName}
            onChange={(e) => onInputChange('accountHolderName', e.target.value)}
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
            label="Account Number"
            placeholder="Enter your account number"
            value={formData.accountNumber}
            onChange={(e) => onInputChange('accountNumber', e.target.value)}
            disabled={isLoading}
            required
            type="password"
            className="font-mono"
          />

          <FormField
            id="routing-number"
            label="Routing Number"
            placeholder="Enter routing/sort code"
            value={formData.routingNumber}
            onChange={(e) => onInputChange('routingNumber', e.target.value)}
            disabled={isLoading}
            required
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-type" className="text-sm font-medium">
            Account Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => onInputChange('accountType', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Checking Account
                </div>
              </SelectItem>
              <SelectItem value="savings">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Savings Account
                </div>
              </SelectItem>
              <SelectItem value="business">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Business Account
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankAccountDetailsForm;
