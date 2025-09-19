'use client';

import { InputField, TextareaField } from '@/components/common/forms';
import { RadioField } from '@/components/common/forms/radio';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { ProcessMembershipMode } from '../../data/api';
import { EditTierBenefitFormValues } from '../schema';

const useEditTierBenefitFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext<EditTierBenefitFormValues>();

  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );

  const fields = [
    <InputField
      key="name"
      name="name"
      label="Benefit Name"
      placeholder="Benefit Tier Name"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
      gridClassName="col-span-12"
    />,
    <InputField
      key="value"
      name="value"
      label="Benefit Value"
      placeholder="Benefit Tier Value"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
      gridClassName="col-span-6"
    />,

    <InputField
      key="unit"
      name="unit"
      placeholder="Benefit Unit"
      label="Benefit Unit"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
      gridClassName="col-span-6"
    />,

    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Benefit Tier Description"
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
      gridClassName="col-span-12"
    />,
    <RadioField
      key="mode"
      name="mode"
      label="Select Mode"
      options={[
        {
          label: 'This Tier Only',
          value: ProcessMembershipMode.UPDATE,
        },
        {
          label: 'All Tier',
          value: ProcessMembershipMode.UPDATE_ALL,
        },
      ]}
      value={watch('mode')}
      orientation="horizontal"
      variant="card"
      equalWidth
      gridClassName="col-span-12"
    />,
  ];

  return fields;
};

export default useEditTierBenefitFieldConfig;
