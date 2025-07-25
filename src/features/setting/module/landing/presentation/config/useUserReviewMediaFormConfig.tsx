'use client';

import { InputField, TextareaField } from '@/components/common/forms';
import StarRatingField from '@/components/common/forms/star-rating/StarRatingField';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useUserReviewMediaFormConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  const fields = [
    <InputField
      key={`${mediaPath}.mediaReviewUser.media_user_name`}
      name={`${mediaPath}.mediaReviewUser.media_user_name`}
      label="User Name"
      required
      disabled={isSubmitting || isLoadingSaveChange}
    />,
    <InputField
      key={`${mediaPath}.mediaReviewUser.media_user_title`}
      name={`${mediaPath}.mediaReviewUser.media_user_title`}
      label="User Title"
      required
      disabled={isSubmitting || isLoadingSaveChange}
    />,
    <TextareaField
      key={`${mediaPath}.mediaReviewUser.media_user_comment`}
      name={`${mediaPath}.mediaReviewUser.media_user_comment`}
      label="User Comment"
      required
      disabled={isSubmitting || isLoadingSaveChange}
    />,
    <StarRatingField
      key="media_user_rating"
      name={`${mediaPath}.mediaReviewUser.media_user_rating`}
      label="User Rating"
      required
      disabled={isSubmitting || isLoadingSaveChange}
      maxStars={5}
    />,
  ];

  return fields;
};

export default useUserReviewMediaFormConfig;
