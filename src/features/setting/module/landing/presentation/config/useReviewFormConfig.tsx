'use client';

import { InputField, SelectField, TextareaField } from '@/components/common/forms';
import { MediaTypeEnum } from '@/features/landing/constants';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useReviewFormConfig = (mediaPath: string, mediaType: MediaTypeEnum) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  const mediaTypeOptions = Object.values(MediaTypeEnum).map((type) => ({
    label: type,
    value: type,
  }));

  const fields = [
    <SelectField
      options={mediaTypeOptions}
      key="mediaType"
      name={`${mediaPath}.media_type`}
      label="Media Type"
      disabled={true}
      required
    />,

    <TextareaField
      key="description"
      name={`${mediaPath}.description`}
      label="Content - Description"
      required
      disabled={isSubmitting || isLoadingSaveChange}
    />,

    <InputField
      key="redirect_url"
      name={`${mediaPath}.redirect_url`}
      label="Redirect URL"
      required
      disabled={isSubmitting}
    />,
  ];

  if (mediaType === MediaTypeEnum.EMBEDDED) {
    fields.push(
      <TextareaField
        key={`${mediaPath}.embed_code`}
        name={`${mediaPath}.embed_code`}
        label="Embed Code"
        required
        disabled={isSubmitting || isLoadingSaveChange}
      />,
    );
  }

  return fields;
};

export default useReviewFormConfig;
