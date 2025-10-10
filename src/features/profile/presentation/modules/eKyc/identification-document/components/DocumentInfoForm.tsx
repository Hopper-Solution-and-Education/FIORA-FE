'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { DateTimePicker } from '@/components/common/forms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IdentificationDocumentType } from '@/features/profile/domain/entities/models/profile';
import { CreditCard, HelpCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IdentificationDocument } from '../../../../schema/personalInfoSchema';

interface DocumentInfoFormProps {
  form: UseFormReturn<IdentificationDocument>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const DocumentInfoForm: React.FC<DocumentInfoFormProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const watchedValues = watch();
  const currentType = watch('type');

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-base sm:text-lg">Document Information</CardTitle>
          <CommonTooltip content="Your documents are encrypted and securely processed. We use this information only for identity verification as required by law.">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </CommonTooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Type Selector */}
        <div className="space-y-2">
          <Label htmlFor="document-type" className="text-sm font-medium">
            Document Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`select-${currentType || 'empty'}`}
            value={currentType || ''}
            onValueChange={(value: IdentificationDocumentType) => {
              setValue('type', value);
            }}
            disabled={isSubmitting || isLoadingData || disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={IdentificationDocumentType.NATIONAL}>National ID</SelectItem>
              <SelectItem value={IdentificationDocumentType.PASSPORT}>Passport</SelectItem>
              <SelectItem value={IdentificationDocumentType.BUSINESS}>Business License</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="id-number" className="text-sm font-medium">
              Document Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="id-number"
              placeholder="Enter document number"
              {...register('idNumber', { required: 'Document number is required' })}
              disabled={isSubmitting || disabled}
            />
            {errors.idNumber && <p className="text-sm text-red-500">{errors.idNumber.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="issued-date" className="text-sm font-medium">
              Issue Date <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              required
              value={watchedValues.issuedDate ? new Date(watchedValues.issuedDate) : undefined}
              onChange={(date) => setValue('issuedDate', date?.toISOString().split('T')[0] || '')}
              disabled={isSubmitting || disabled}
            />
            {errors.issuedDate && (
              <p className="text-sm text-red-500">{errors.issuedDate.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="place-issuance" className="text-sm font-medium">
            Place of Issuance <span className="text-red-500">*</span>
          </Label>
          <Input
            id="place-issuance"
            placeholder="Enter the issuing authority or location"
            {...register('issuedPlace', { required: 'Place of issuance is required' })}
            disabled={isSubmitting || disabled}
          />
          {errors.issuedPlace && (
            <p className="text-sm text-red-500">{errors.issuedPlace.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address on Document <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            placeholder="Enter address as shown on document"
            {...register('idAddress', { required: 'Address is required' })}
            disabled={isSubmitting || disabled}
          />
          {errors.idAddress && <p className="text-sm text-red-500">{errors.idAddress.message}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentInfoForm;
