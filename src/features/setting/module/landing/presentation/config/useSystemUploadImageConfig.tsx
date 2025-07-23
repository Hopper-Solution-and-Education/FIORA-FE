'use client';

import { UploadField } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';

const useSystemUploadImageConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const fields = [
    <UploadField
      key={`${mediaPath}.media_url`}
      name={`${mediaPath}.media_url`}
      label="Upload System Image"
      disabled={isSubmitting}
      required
    />,
  ];

  return fields;
};

export default useSystemUploadImageConfig;
