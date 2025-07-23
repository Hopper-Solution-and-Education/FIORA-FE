'use client';

import { UploadImageField } from '@/components/common/forms';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useReviewUploadImageConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  const fields = [
    <UploadImageField
      key={`${mediaPath}.mediaReviewUser.media_user_avatar`}
      name={`${mediaPath}.mediaReviewUser.media_user_avatar`}
      label="Upload Review User"
      disabled={isSubmitting || isLoadingSaveChange}
      required
    />,
  ];

  return fields;
};

export default useReviewUploadImageConfig;
