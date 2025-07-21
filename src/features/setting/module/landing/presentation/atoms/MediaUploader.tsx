'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionTypeEnum } from '@/features/landing/constants';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { MediaType } from '@prisma/client';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldError, FieldErrors, useFormContext } from 'react-hook-form';

interface MediaUploaderProps {
  mediaType: MediaType;
  mediaPath: string;
  sectionType: SectionTypeEnum;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ mediaType, mediaPath, sectionType }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        setValue(`${mediaPath}.media_url`, fileUrl, { shouldValidate: true });
        setFileName(file.name);
      }
    },
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        setValue(`${mediaPath}.media_url_2`, fileUrl, { shouldValidate: true });
        setFileName(file.name);
      }
    },
  });

  const mediaUrl = watch(`${mediaPath}.media_url`);
  const mediaUrl2 = watch(`${mediaPath}.media_url_2`);

  const getNestedError = (errors: FieldErrors, path: string): FieldError | undefined => {
    const keys = path.split('.');
    let current: any = errors;
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key];
      } else return undefined;
    }
    return current as FieldError | undefined;
  };

  const mediaError = getNestedError(errors, `${mediaPath}.media_url`);
  const mediaUrl2Error = getNestedError(errors, `${mediaPath}.media_url_2`);
  // Function to clear the uploaded file
  const handleRemoveFile = () => {
    setValue(`${mediaPath}.media_url`, '', { shouldValidate: true });
    setFileName(null);
  };

  if (mediaType !== MediaType.IMAGE && mediaType !== MediaType.VIDEO) {
    return null;
  }

  return (
    <div>
      <div>
        <Label htmlFor={`${mediaPath}.media_url`}>Media URL</Label>
        <Input
          type="hidden"
          id={`${mediaPath}.media_url`}
          {...register(`${mediaPath}.media_url`)}
        />

        <div className="flex items-center py-2 gap-5">
          <div {...getRootProps()} className="cursor-pointer rounded-md">
            <input data-test="media-uploader-input" {...getInputProps()} />
            <Button variant="outline" type="button">
              <Upload className="h-4 w-4 mr-2" />
              Upload {mediaType === MediaType.IMAGE ? 'Image' : 'Video'}
            </Button>
          </div>

          <div className="flex-1">
            {/* Display media_url as a clickable link if it exists */}
            {mediaUrl ? (
              <div className="flex items-center">
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm text-blue-600 hover:underline truncate ${isMobile ? 'max-w-[100px]' : 'max-w-[300px]'}`}
                  title={mediaUrl}
                >
                  {mediaUrl}
                </a>
              </div>
            ) : fileName ? (
              <div className="flex items-center">
                <p
                  className={`text-sm text-gray-600 truncate ${isMobile ? 'max-w-[100px]' : 'max-w-[300px]'} `}
                  title={fileName}
                >
                  {fileName}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No file selected</p>
            )}

            {/* Display error in red only if there’s an error and no valid media_url */}
            {mediaError && !mediaUrl && (
              <p className="text-red-500 text-sm mt-1">{mediaError.message}</p>
            )}
          </div>
        </div>
      </div>

      {mediaType === MediaType.IMAGE && sectionType === SectionTypeEnum.KPS && (
        <div>
          <Label htmlFor={`${mediaPath}.media_url_2`}>Media URL Flip Back</Label>
          <Input
            type="hidden"
            id={`${mediaPath}.media_url_2`}
            {...register(`${mediaPath}.media_url_2`)}
          />

          <div className="flex items-center py-2 gap-5">
            <div {...getRootProps2()} className="cursor-pointer rounded-md">
              <input data-test="media-uploader-input" {...getInputProps2()} />
              <Button variant="outline" type="button">
                <Upload className="h-4 w-4 mr-2" />
                Upload {mediaType === MediaType.IMAGE ? 'Image' : 'Video'}
              </Button>
            </div>

            <div className="flex-1">
              {/* Display media_url as a clickable link if it exists */}
              {mediaUrl2 ? (
                <div className="flex items-center">
                  <a
                    href={mediaUrl2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm text-blue-600 hover:underline truncate ${isMobile ? 'max-w-[100px]' : 'max-w-[300px]'}`}
                    title={mediaUrl2}
                  >
                    {mediaUrl2}
                  </a>
                </div>
              ) : fileName ? (
                <div className="flex items-center">
                  <p
                    className={`text-sm text-gray-600 truncate ${isMobile ? 'max-w-[100px]' : 'max-w-[300px]'} `}
                    title={fileName}
                  >
                    {fileName}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No file selected</p>
              )}

              {/* Display error in red only if there’s an error and no valid media_url */}
              {mediaUrl2Error && !mediaUrl2 && (
                <p className="text-red-500 text-sm mt-1">{mediaUrl2Error.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
