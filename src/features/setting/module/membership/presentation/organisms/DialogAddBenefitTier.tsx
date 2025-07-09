import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { FormProvider, useForm } from 'react-hook-form';
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

const DialogAddBenefitTier = ({ open, onOpenChange }: DialogAddBenefitTierProps) => {
  const methods = useForm<AddBenefitTierFormValues>({
    resolver: yupResolver(addBenefitTierSchema),
    defaultValues: defaultAddBenefitTierValue,
  });

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const onSubmit = (data: AddBenefitTierFormValues) => {
    dispatch(
      addNewBenefitAsyncThunk({
        ...data,
        description: data.description || '',
        userId: session?.user?.id || '',
      }),
    )
      .unwrap()
      .then(() => {
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <AddBenefitForm />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddBenefitTier;
