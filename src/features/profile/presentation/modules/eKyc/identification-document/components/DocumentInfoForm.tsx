'use client';

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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  IdentificationDocumentFormData,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import { CreditCard, HelpCircle } from 'lucide-react';

interface DocumentInfoFormProps {
  formData: IdentificationDocumentFormData;
  onInputChange: (field: keyof IdentificationDocumentFormData, value: string) => void;
  isLoading: boolean;
  isSubmitting: boolean;
  isLoadingData: boolean;
}

const DocumentInfoForm: React.FC<DocumentInfoFormProps> = ({
  formData,
  onInputChange,
  isLoading,
  isSubmitting,
  isLoadingData,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-base sm:text-lg">Document Information</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Your documents are encrypted and securely processed. We use this information only
                for identity verification as required by law.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Type Selector */}
        <div className="space-y-2">
          <Label htmlFor="document-type" className="text-sm font-medium">
            Document Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value: IdentificationDocumentType) => onInputChange('type', value)}
            disabled={isSubmitting || isLoadingData}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NATIONAL">National ID</SelectItem>
              <SelectItem value="PASSPORT">Passport</SelectItem>
              <SelectItem value="BUSINESS">Business License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="id-number" className="text-sm font-medium">
              Document Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="id-number"
              placeholder="Enter document number"
              value={formData.idNumber}
              onChange={(e) => onInputChange('idNumber', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issued-date" className="text-sm font-medium">
              Issue Date <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              required
              value={formData.issuedDate ? new Date(formData.issuedDate) : undefined}
              onChange={(e) => onInputChange('issuedDate', e?.toISOString() || '')}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="place-issuance" className="text-sm font-medium">
            Place of Issuance <span className="text-red-500">*</span>
          </Label>
          <Input
            id="place-issuance"
            placeholder="Enter the issuing authority or location"
            value={formData.issuedPlace}
            onChange={(e) => onInputChange('issuedPlace', e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address on Document <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            placeholder="Enter address as shown on document"
            value={formData.idAddress}
            onChange={(e) => onInputChange('idAddress', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentInfoForm;
