'use client';

import { UploadField } from '@/components/common/forms';
import { Controller, UseFormReturn } from 'react-hook-form';
import { IdentificationDocument } from '../../../../schema/personalInfoSchema';

interface BusinessLicenseUploadProps {
  form: UseFormReturn<IdentificationDocument>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const BusinessLicenseUpload: React.FC<BusinessLicenseUploadProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="space-y-8">
      {/* Front and Back Side of Business License */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Controller
            name="frontImage"
            control={form.control}
            render={({ field }) => (
              <UploadField
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Front side of the Business License"
                placeholder="Upload the front side of your Business License"
                description="(JPG, PNG, or PDF, max 5MB)"
                disabled={isSubmitting || isLoadingData || disabled}
                initialImageUrl={form.watch('initialFrontImage')}
                required
                size="large"
              />
            )}
          />
          {errors.frontImage && <p className="text-sm text-red-500">{errors.frontImage.message}</p>}
        </div>

        <div className="space-y-2">
          <Controller
            name="backImage"
            control={form.control}
            render={({ field }) => (
              <UploadField
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Back side of the Business License"
                placeholder="Upload the back side of your Business License"
                description="(JPG, PNG, or PDF, max 5MB)"
                disabled={isSubmitting || isLoadingData || disabled}
                required
                size="large"
                initialImageUrl={form.watch('initialBackImage')}
              />
            )}
          />
          {errors.backImage && <p className="text-sm text-red-500">{errors.backImage.message}</p>}
        </div>
      </div>

      {/* Office Address Photo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Controller
            name="locationImage"
            control={form.control}
            render={({ field }) => (
              <UploadField
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Office address"
                placeholder="Upload a photo clearly showing your office address"
                description="(JPG, PNG, or PDF, max 5MB)"
                disabled={isSubmitting || isLoadingData || disabled}
                size="large"
                initialImageUrl={form.watch('initialLocationImage')}
                required
              />
            )}
          />
          {errors.locationImage && (
            <p className="text-sm text-red-500">{errors.locationImage.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessLicenseUpload;
