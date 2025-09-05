'use client';

import { UploadImageField } from '@/components/common/forms';
import { MediaTypeEnum } from '@/features/landing/constants';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useReviewUploadImageConfig = (mediaPath: string, mediaType: MediaTypeEnum) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  let fields = [
    <UploadImageField
      key={`${mediaPath}.mediaReviewUser.media_user_avatar`}
      name={`${mediaPath}.mediaReviewUser.media_user_avatar`}
      label="Upload Review User"
      disabled={isSubmitting || isLoadingSaveChange}
      required
      className="h-100 w-100"
    />,
  ];

  if (mediaType === MediaTypeEnum.IMAGE) {
    fields = [
      <UploadImageField
        key={`${mediaPath}.media_url`}
        name={`${mediaPath}.media_url`}
        label="Upload Image"
        disabled={isSubmitting || isLoadingSaveChange}
        required
        size="large"
        className="h-100 w-100"
      />,
      ...fields,
    ];
  }

  return fields;
};

export default useReviewUploadImageConfig;
