'use client';

import { InputField } from '@/components/common/forms';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { EditThresholdTierFormValues } from '../schema/editThresholdTier.schema';

const useEditThresholdBenefitTierConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext<EditThresholdTierFormValues>();

  const isLoadingEditThresholdBenefit = useAppSelector(
    (state) => state.memberShipSettings.isLoadingEditThresholdBenefit,
  );

  const fields = [
    // <InputField key="axis" name="axis" label="Axis" placeholder="Axis" required disabled={true} />,
    <InputField
      key="newMin"
      name="newMin"
      placeholder="New Min"
      label="Min"
      required
      disabled={isSubmitting || isLoadingEditThresholdBenefit || watch('newMin') === Infinity}
    />,
    <InputField
      key="newMax"
      name="newMax"
      placeholder="New Max"
      label="Max"
      required
      disabled={isSubmitting || isLoadingEditThresholdBenefit || watch('newMax') === Infinity}
    />,
  ];

  return fields;
};

export default useEditThresholdBenefitTierConfig;
