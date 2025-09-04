import { GlobalDialog } from '@/components/common/molecules';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ProcessMembershipMode } from '../../data/api';
import { setIsShowDialogEditBenefitTier } from '../../slices';
import { EditTierBenefitForm } from '../molecules';
import {
  defaultEditTierBenefitValue,
  EditTierBenefitFormValues,
  editTierBenefitSchema,
} from '../schema';

const DialogEditBenefitTier = () => {
  const methods = useForm<EditTierBenefitFormValues>({
    resolver: yupResolver(editTierBenefitSchema),
    defaultValues: defaultEditTierBenefitValue,
    mode: 'onBlur',
  });
  const isShowDialogEditBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.editBenefitTier.isShowDialogEditBenefitTier,
  );
  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );
  const benefitTierToEdit = useAppSelector(
    (state) => state.memberShipSettings.editBenefitTier.benefitTierToEdit,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (benefitTierToEdit) {
      methods.reset({
        name: benefitTierToEdit?.label || '',
        value: benefitTierToEdit?.value || 0,
        unit: benefitTierToEdit?.suffix || '',
        mode: ProcessMembershipMode.UPDATE, // Default mode
      });
    }
  }, [benefitTierToEdit, methods]);

  return (
    <GlobalDialog
      open={isShowDialogEditBenefitTier}
      onOpenChange={() => dispatch(setIsShowDialogEditBenefitTier(!isShowDialogEditBenefitTier))}
      renderContent={() => (
        <FormProvider {...methods}>
          <EditTierBenefitForm />
        </FormProvider>
      )}
      title="Edit Benefit"
      heading="Are you sure you want to edit this benefit?"
      description="This action cannot be undone."
      customLeftButton={<></>}
      customRightButton={<></>}
      isLoading={isLoadingAddUpdateBenefitTier}
      type="info"
    />
  );
};

export default DialogEditBenefitTier;
