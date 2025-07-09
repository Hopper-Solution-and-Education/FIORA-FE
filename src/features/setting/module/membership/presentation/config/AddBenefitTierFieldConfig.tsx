'use client';

import { InputField, TextareaField } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';

const useAddBenefitTierFieldConfig = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const fields = [
    <InputField
      key="name"
      name="name"
      label="Name"
      placeholder="Benefit Tier Name"
      required
      disabled={isSubmitting}
    />,
    <InputField
      key="slug"
      name="slug"
      placeholder="Slug"
      label="Slug"
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
