'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldError, FieldErrors, useFormContext } from 'react-hook-form';

interface MediaUploaderProps {
  mediaPath: string;
}

const MediaReviewUserUpload: React.FC<MediaUploaderProps> = ({ mediaPath }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const MAX_FILE_SIZE_MB = 10;
  const [error, setError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          setError('File size must be less than 10MB');
          return;
        }
        setError('');
        const fileUrl = URL.createObjectURL(file);
        setValue(`${mediaPath}.mediaReviewUser.media_user_avatar`, fileUrl, {
          shouldValidate: true,
        });
        setFileName(file.name);
      }
    },
  });

  const userReview = watch(`${mediaPath}.mediaReviewUser.media_user_avatar`);

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

  const mediaError = getNestedError(errors, `${mediaPath}.mediaReviewUser.media_user_avatar`);
  // Function to clear the uploaded file
  const handleRemoveFile = () => {
    setValue(`${mediaPath}.mediaReviewUser.media_user_avatar`, '', { shouldValidate: true });
    setFileName(null);
  };

  return (
    <div>
      <div>
        <Label htmlFor={`${mediaPath}.media_url`}>Media Review User</Label>
        <Input
          type="hidden"
          id={`${mediaPath}.mediaReviewUser.media_user_avatar`}
          {...register(`${mediaPath}.mediaReviewUser.media_user_avatar`)}
        />

        <div className="flex items-center py-2 gap-5">
          <div {...getRootProps()} className="cursor-pointer rounded-md">
            <input data-test="media-uploader-input" {...getInputProps()} />
            <Button variant="outline" type="button">
              <Upload className="h-4 w-4 mr-2" />
              Upload Review User
            </Button>
          </div>

          <div className="flex-1">
            {/* Display media_url as a clickable link if it exists */}
            {userReview ? (
              <div className="flex items-center">
                <a
                  href={userReview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm text-blue-600 hover:underline truncate ${isMobile ? 'max-w-[100px]' : 'max-w-[300px]'}`}
                  title={userReview}
                >
                  {userReview}
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

            {mediaError && !userReview && (
              <p className="text-red-500 text-sm mt-1">{mediaError.message}</p>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaReviewUserUpload;
