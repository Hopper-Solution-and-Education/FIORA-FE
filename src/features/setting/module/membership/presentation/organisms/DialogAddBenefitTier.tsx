import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
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

  const onSubmit = (data: AddBenefitTierFormValues) => {
    console.log(data);
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
