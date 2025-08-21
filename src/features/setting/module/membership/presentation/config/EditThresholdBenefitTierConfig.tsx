'use client';

import { InputField } from '@/components/common/forms';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useEditThresholdBenefitTierConfig = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );

  const fields = [
    <InputField
      key="axis"
      name="axis"
      label="Axis"
      placeholder="Axis"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <InputField
      key="oldMin"
      name="oldMin"
      placeholder="Old Min"
      label="Old Min"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <InputField
      key="oldMax"
      name="oldMax"
      placeholder="Old Max"
      label="Old Max"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <InputField
      key="newMin"
      name="newMin"
      placeholder="New Min"
      label="New Min"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
    <InputField
      key="newMax"
      name="newMax"
      placeholder="New Max"
      label="New Max"
      required
      disabled={isSubmitting || isLoadingAddUpdateBenefitTier}
    />,
  ];

  return fields;
};

export default useEditThresholdBenefitTierConfig;
