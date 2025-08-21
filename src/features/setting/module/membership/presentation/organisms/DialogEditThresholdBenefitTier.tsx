import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { editThresholdBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';

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

  const selectMembershipBenefit = useAppSelector(
    (state) => state.memberShipSettings.selectedMembership,
  );

  const dispatch = useAppDispatch();

  const onSubmit = (data: EditThresholdTierFormValues) => {
    if (!selectMembershipBenefit) {
      toast.error('Please select a membership benefit');
      return;
    }

    dispatch(
      editThresholdBenefitAsyncThunk({
        axis: data.axis,
        oldMin: data.oldMin,
        oldMax: data.oldMax,
        newMin: data.newMin,
        newMax: data.newMax,
      }),
    )
      .unwrap()
      .then(() => {
        methods.reset();
        dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
      });
  };

  const { handleSubmit } = methods;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Threshold Benefit Tier</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form data-test="dialog-add-benefit-tier" onSubmit={handleSubmit(onSubmit)}>
            <EditThresholdBenefitForm />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditThresholdBenefitTier;
