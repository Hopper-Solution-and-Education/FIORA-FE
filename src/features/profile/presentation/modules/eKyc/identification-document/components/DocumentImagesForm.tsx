'use client';

import { UploadField } from '@/components/common/forms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, HelpCircle } from 'lucide-react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { IdentificationDocument } from '../../../../schema/personalInfoSchema';

type FormData = IdentificationDocument;

interface DocumentImagesFormProps {
  form: UseFormReturn<FormData>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const DocumentImagesForm: React.FC<DocumentImagesFormProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const {
    formState: { errors, isSubmitting },
  } = form;
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          <CardTitle className="text-base sm:text-lg">Document Images</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>Document Requirements:</p>
                <ul className="text-xs space-y-1">
                  <li>• Document should be in good condition and clearly visible</li>
                  <li>• Ensure there is no light glare, shadows, or reflections</li>
                  <li>• Do not use screenshots or photocopies</li>
                  <li>• All text and details must be readable</li>
                  <li>• File size should not exceed 5MB per document</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Front and Back Side */}
          <div className="grid grid-cols-2 gap-6">
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
                    label="Front Side of Document"
                    placeholder="Choose front side image"
                    disabled={isSubmitting || isLoadingData || disabled}
                    initialImageUrl={form.watch('initialFrontImage')}
                    required
                    size="large"
                  />
                )}
              />
              {errors.frontImage && (
                <p className="text-sm text-red-500">{errors.frontImage.message}</p>
              )}
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
                    label="Back Side of Document"
                    placeholder="Choose back side image"
                    disabled={isSubmitting || isLoadingData || disabled}
                    required
                    size="large"
                    initialImageUrl={form.watch('initialBackImage')}
                  />
                )}
              />
              {errors.backImage && (
                <p className="text-sm text-red-500">{errors.backImage.message}</p>
              )}
            </div>
          </div>

          {/* Face Photo */}
          <div className="grid grid-cols-2 gap-6">
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
                    label="Portrait Photo"
                    placeholder="Choose portrait photo"
                    disabled={isSubmitting || isLoadingData || disabled}
                    size="large"
                    initialImageUrl={form.watch('initialFacePhoto')}
                    required
                  />
                )}
              />
              {errors.facePhoto && (
                <p className="text-sm text-red-500">{errors.facePhoto.message}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentImagesForm;
