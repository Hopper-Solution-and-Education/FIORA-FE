'use client';

import { InputField, TextareaField } from '@/components/common/forms';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

const useAddBenefitTierFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = useFormContext();

  useEffect(() => {
    if (watch('name')) {
      const baseSlug = watch('name').toLowerCase().replace(/ /g, '-');
      const uuid = uuidv4().split('-')[0];
      setValue('slug', `${baseSlug}-${uuid}`);
    }
  }, [watch('name')]);

  const fields = [
    <InputField
      key="name"
      name="name"
      label="Name"
      placeholder="Benefit Tier Name"
      required
      disabled={isSubmitting}
    />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Benefit Tier Description"
      disabled={isSubmitting}
    />,
    <InputField
      key="suffix"
      name="suffix"
      placeholder="Suffix"
      label="Suffix"
      required
      disabled={isSubmitting}
    />,
  ];

  return fields;
};

export default useAddBenefitTierFieldConfig;
