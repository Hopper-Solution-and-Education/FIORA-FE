import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { setIsShowDialogAddBenefitTier } from '../../slices';
import { addNewBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';
import { AddBenefitForm } from '../molecules';
import {
  AddBenefitTierFormValues,
  addBenefitTierSchema,
  defaultAddBenefitTierValue,
} from '../schema';

type DialogAddBenefitTierProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/*
  This component is used to add a new benefit tier.
  It is used in the MembershipBenefit component.
*/
const DialogAddBenefitTier = ({ open, onOpenChange }: DialogAddBenefitTierProps) => {
  const methods = useForm<AddBenefitTierFormValues>({
    resolver: yupResolver(addBenefitTierSchema),
    defaultValues: defaultAddBenefitTierValue,
  });

  const selectMembershipBenefit = useAppSelector(
    (state) => state.memberShipSettings.selectedMembership,
  );

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const onSubmit = (data: AddBenefitTierFormValues) => {
    if (!selectMembershipBenefit) {
      toast.error('Please select a membership benefit');
      return;
    }

    dispatch(
      addNewBenefitAsyncThunk({
        data: {
          tierBenefit: {
            tierId: selectMembershipBenefit?.id || '',
            value: 0,
          },
          membershipBenefit: {
            name: data.name,
            slug: data.slug,
            userId: session?.user?.id || '',
            description: data.description || '',
            suffix: data.suffix,
          },
        },
        setError: methods.setError,
      }),
    )
      .unwrap()
      .then(() => {
        methods.reset();
        dispatch(setIsShowDialogAddBenefitTier(false));
        dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
      });
  };

  const { handleSubmit } = methods;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Benefit Tier</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form data-test="dialog-add-benefit-tier" onSubmit={handleSubmit(onSubmit)}>
            <AddBenefitForm />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddBenefitTier;
