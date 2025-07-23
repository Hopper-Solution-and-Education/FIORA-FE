'use client';

import { UploadField } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';

const useKSPUploadImageConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const fields = [
    <UploadField
      key={`${mediaPath}.media_url`}
      name={`${mediaPath}.media_url`}
      label="Upload Image"
      disabled={isSubmitting}
      required
    />,

    <UploadField
      key={`${mediaPath}.media_url_2`}
      name={`${mediaPath}.media_url_2`}
      label="Upload Image Flip Back"
      disabled={isSubmitting}
      required
    />,
  ];

  return fields;
};

export default useKSPUploadImageConfig;
