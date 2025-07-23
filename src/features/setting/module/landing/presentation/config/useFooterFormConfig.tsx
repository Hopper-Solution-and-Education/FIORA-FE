'use client';

import { InputField, SelectField, TextareaField } from '@/components/common/forms';
import { MediaTypeEnum } from '@/features/landing/constants';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useFooterFormConfig = (mediaPath: string) => {
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
      disabled={isSubmitting || isLoadingSaveChange}
      required
    />,

    <TextareaField
      key={`${mediaPath}.description`}
      name={`${mediaPath}.description`}
      label="Content - Description"
      required
      disabled={isSubmitting || isLoadingSaveChange}
    />,

    <InputField
      key={`${mediaPath}.redirect_url`}
      name={`${mediaPath}.redirect_url`}
      label="Redirect URL"
      required
      disabled={isSubmitting || isLoadingSaveChange}
    />,
  ];

  return fields;
};

export default useFooterFormConfig;
