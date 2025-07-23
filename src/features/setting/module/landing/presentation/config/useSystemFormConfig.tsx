'use client';

import { InputField, SelectField, TextareaField } from '@/components/common/forms';
import { MediaTypeEnum } from '@/features/landing/constants';
import { useFormContext } from 'react-hook-form';

const useSystemFormConfig = (mediaPath: string) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

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
      disabled={isSubmitting}
    />,

    <InputField
      key="redirect_url"
      name={`${mediaPath}.redirect_url`}
      label="Redirect URL"
      required
      disabled={isSubmitting}
    />,
  ];

  return fields;
};

export default useSystemFormConfig;
