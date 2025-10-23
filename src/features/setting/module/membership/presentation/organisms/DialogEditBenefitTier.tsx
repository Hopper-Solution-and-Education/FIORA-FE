import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { GlobalDialog } from '@/components/common/molecules';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
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
  const { formState } = methods;
  const formRef = useRef<HTMLFormElement>(null!);

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
        description: benefitTierToEdit?.description || '',
        mode: ProcessMembershipMode.UPDATE,
      });
    }
  }, [benefitTierToEdit, methods]);

  // Trigger form submission programmatically
  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <GlobalDialog
      open={isShowDialogEditBenefitTier}
      onOpenChange={() => dispatch(setIsShowDialogEditBenefitTier(!isShowDialogEditBenefitTier))}
      renderContent={() => (
        <FormProvider {...methods}>
          <EditTierBenefitForm formRef={formRef} />
        </FormProvider>
      )}
      title="Edit Benefit"
      heading="Are you sure you want to edit this benefit?"
      description="This action cannot be undone."
      customLeftButton={
        <CommonTooltip content="Cancel and go back">
          <Button
            variant="outline"
            type="button"
            onClick={() => dispatch(setIsShowDialogEditBenefitTier(false))}
            className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
            data-test="form-cancel-button"
          >
            <Icons.circleArrowLeft className="h-5 w-5" />
          </Button>
        </CommonTooltip>
      }
      customRightButton={
        <CommonTooltip content={formState.isSubmitting ? 'Submitting...' : 'Submit'}>
          <Button
            type="submit"
            disabled={!formState.isValid || formState.isSubmitting || formState.isValidating}
            onClick={handleFormSubmit} // Trigger form submission
            className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            data-test="form-submit-button"
          >
            {formState.isSubmitting || isLoadingAddUpdateBenefitTier ? (
              <Icons.spinner className="animate-spin h-5 w-5" />
            ) : (
              <Icons.check className="h-5 w-5" />
            )}
          </Button>
        </CommonTooltip>
      }
      isLoading={isLoadingAddUpdateBenefitTier}
      type="info"
    />
  );
};

export default DialogEditBenefitTier;
