'use client';

import { IconSelectUpload } from '@/components/common/forms';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useSystemUploadImageConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  const fields = [
    <IconSelectUpload
      key={`${mediaPath}.media_url`}
      name={`${mediaPath}.media_url`}
      label="Upload System Image"
      disabled={isSubmitting || isLoadingSaveChange}
      required
    />,
  ];

  return fields;
};

export default useSystemUploadImageConfig;
