'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, HelpCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TaxInformation } from '../../../../schema/personalInfoSchema';

interface TaxDetailsFormProps {
  form: UseFormReturn<TaxInformation>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const TaxDetailsForm: React.FC<TaxDetailsFormProps> = ({
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
          <FileText className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-base sm:text-lg">Tax Details</CardTitle>
          <CommonTooltip content="Tax information is required for regulatory compliance and may affect your account features and limits.">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </CommonTooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tax-code" className="text-sm font-medium">
            Tax Identification Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tax-code"
            placeholder="Enter your tax ID number"
            {...register('taxId', { required: 'Tax identification number is required' })}
            disabled={isSubmitting || isLoadingData || disabled}
          />
          {errors.taxId && <p className="text-sm text-red-500">{errors.taxId.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxDetailsForm;
