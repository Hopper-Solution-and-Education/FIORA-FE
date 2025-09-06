'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FormField } from '@/features/profile/shared/components';
import { FileText, HelpCircle } from 'lucide-react';

interface TaxDetailsFormProps {
  taxId: string;
  onTaxIdChange: (value: string) => void;
  isLoading?: boolean;
}

const TaxDetailsForm: React.FC<TaxDetailsFormProps> = ({
  taxId,
  onTaxIdChange,
  isLoading = false,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-base sm:text-lg">Tax Details</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Tax information is required for regulatory compliance and may affect your account
                features and limits.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          id="tax-code"
          label="Tax Identification Number"
          placeholder="Enter your tax ID number"
          value={taxId}
          onChange={(e) => onTaxIdChange(e.target.value)}
          disabled={isLoading}
          required
          tooltip="This could be your SSN, TIN, or equivalent tax identifier"
        />
      </CardContent>
    </Card>
  );
};

export default TaxDetailsForm;
