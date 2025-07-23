'use client';

import { UploadField } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';

const useReviewUploadImageConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const fields = [
    <UploadField
      key={`${mediaPath}.mediaReviewUser.media_user_avatar`}
      name={`${mediaPath}.mediaReviewUser.media_user_avatar`}
      label="Upload Review User"
      disabled={isSubmitting}
      required
    />,
  ];

  return fields;
};

export default useReviewUploadImageConfig;
