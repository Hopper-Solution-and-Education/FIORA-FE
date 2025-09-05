'use client';

import UploadImageField from '@/components/common/forms/upload/UploadImageField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, HelpCircle } from 'lucide-react';

interface DocumentImagesFormProps {
  frontImageUrl: string | null;
  backImageUrl: string | null;
  facePhotoUrl: string | null;
  onFrontImageChange: (url: string | null) => void;
  onBackImageChange: (url: string | null) => void;
  onFacePhotoChange: (url: string | null) => void;
  isSubmitting: boolean;
  isLoadingData: boolean;
}

const DocumentImagesForm: React.FC<DocumentImagesFormProps> = ({
  frontImageUrl,
  backImageUrl,
  facePhotoUrl,
  onFrontImageChange,
  onBackImageChange,
  onFacePhotoChange,
  isSubmitting,
  isLoadingData,
}) => {
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <UploadImageField
              name="front-document"
              label="Front Side of Document"
              placeholder="Choose front side image"
              value={frontImageUrl || undefined}
              onChange={onFrontImageChange}
              disabled={isSubmitting || isLoadingData}
              required
              size="large"
            />
            <UploadImageField
              name="back-document"
              label="Back Side of Document"
              placeholder="Choose back side image"
              value={backImageUrl || undefined}
              onChange={onBackImageChange}
              disabled={isSubmitting || isLoadingData}
              required
              size="large"
            />
          </div>

          {/* Face Photo */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <UploadImageField
              name="face-photo"
              label="Portrait Photo"
              placeholder="Choose portrait photo"
              value={facePhotoUrl || undefined}
              onChange={onFacePhotoChange}
              disabled={isSubmitting || isLoadingData}
              required
              size="large"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentImagesForm;
