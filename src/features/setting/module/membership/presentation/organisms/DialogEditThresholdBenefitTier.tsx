import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';

import { useEffect } from 'react';
import EditThresholdBenefitForm from '../molecules/EditThresholdBenefitForm';
import {
  defaultEditThresholdTierValue,
  EditThresholdTierFormValues,
  editThresholdTierSchema,
} from '../schema/editThresholdTier.schema';

type DialogEditThresholdBenefitTierProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const transformInfinityToZero = (value: number) => {
  if (value === Infinity) {
    return 9999999999;
  }
  return value;
};

/*
  This component is used to add a new benefit tier.
  It is used in the MembershipBenefit component.
*/
const DialogEditThresholdBenefitTier = ({
  open,
  onOpenChange,
}: DialogEditThresholdBenefitTierProps) => {
  const methods = useForm<EditThresholdTierFormValues>({
    resolver: yupResolver(editThresholdTierSchema),
    defaultValues: defaultEditThresholdTierValue,
  });

  const tierToEdit = useAppSelector((state) => state.memberShipSettings.tierToEdit);

  useEffect(() => {
    methods.setValue('axis', tierToEdit.axis);
    methods.setValue('oldMin', tierToEdit.selectedTier?.min || 0);
    methods.setValue('oldMax', tierToEdit.selectedTier?.max || 0);
    methods.setValue('newMin', tierToEdit.selectedTier?.min || 0);
    methods.setValue('newMax', tierToEdit.selectedTier?.max || 0);
  }, [tierToEdit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Threshold Benefit Tier {tierToEdit.selectedTier?.label || ''}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <EditThresholdBenefitForm />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditThresholdBenefitTier;
