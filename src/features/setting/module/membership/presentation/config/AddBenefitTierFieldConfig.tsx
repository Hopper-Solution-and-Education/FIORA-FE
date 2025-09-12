'use client';

import { InputField, TextareaField } from '@/components/common/forms';
import { RadioField } from '@/components/common/forms/radio';
import { useAppSelector } from '@/store';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ProcessMembershipMode } from '../../data/api';

export const formatLabel = (mode: string) => {
  return mode
    .split('-') // tách theo dấu -
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // nối lại bằng khoảng trắng
};

const useAddBenefitTierFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = useFormContext();

  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );

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
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <InputField
      key="value"
      name="value"
      label="Value"
      placeholder="Benefit Tier Value"
      required
      type="number"
      maxLength={11}
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Benefit Tier Description"
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <InputField
      key="suffix"
      name="suffix"
      placeholder="Benefit Unit"
      label="Benefit Unit"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <RadioField
      key="mode"
      name="mode"
      label="Create Mode"
      required
      options={[
        {
          label: 'This Tier Only',
          value: ProcessMembershipMode.CREATE,
        },
        {
          label: 'All Tier',
          value: ProcessMembershipMode.CREATE_ALL,
        },
      ]}
      noneValue={false}
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
      orientation="horizontal"
      variant="card"
      equalWidth
      gridClassName="col-span-12"
    />,
  ];

  return fields;
};

export default useAddBenefitTierFieldConfig;
