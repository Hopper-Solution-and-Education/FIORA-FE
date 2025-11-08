'use client';

import { UploadField } from '@/components/common/forms';
import { Controller, UseFormReturn } from 'react-hook-form';
import { IdentificationDocument } from '../../../../schema/personalInfoSchema';

interface PassportUploadProps {
  form: UseFormReturn<IdentificationDocument>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const PassportUpload: React.FC<PassportUploadProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="space-y-8">
      {/* Personal Information Page and Face Photo */}
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
                label="Personal information page of the passport"
                placeholder="Please upload the photo page of your passport"
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
            name="facePhoto"
            control={form.control}
            render={({ field }) => (
              <UploadField
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Face photo"
                placeholder="Upload a portrait photo of yourself"
                description="(JPG or PNG, max 5MB)"
                disabled={isSubmitting || isLoadingData || disabled}
                size="large"
                initialImageUrl={form.watch('initialFacePhoto')}
                required
              />
            )}
          />
          {errors.facePhoto && <p className="text-sm text-red-500">{errors.facePhoto.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PassportUpload;
