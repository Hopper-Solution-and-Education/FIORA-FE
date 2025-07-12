'use client';

import { InputField, TextareaField } from '@/components/common/forms';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const useAddBenefitTierFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = useFormContext();

  useEffect(() => {
    if (watch('name')) {
      setValue('slug', watch('name').toLowerCase().replace(/ /g, '-'));
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
