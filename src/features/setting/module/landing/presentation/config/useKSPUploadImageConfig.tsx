'use client';

import { UploadImageField } from '@/components/common/forms';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useKSPUploadImageConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  const fields = [
    <UploadImageField
      key={`${mediaPath}.media_url`}
      name={`${mediaPath}.media_url`}
      label="Upload Image"
      disabled={isSubmitting || isLoadingSaveChange}
      required
      className="h-100 w-100"
    />,

    <UploadImageField
      key={`${mediaPath}.media_url_2`}
      name={`${mediaPath}.media_url_2`}
      label="Upload Image Flip Back"
      disabled={isSubmitting || isLoadingSaveChange}
      required
      className="h-100 w-100"
    />,
  ];

  return fields;
};

export default useKSPUploadImageConfig;
