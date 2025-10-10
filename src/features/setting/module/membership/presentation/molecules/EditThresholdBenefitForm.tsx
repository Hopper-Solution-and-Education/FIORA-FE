import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { FormConfig } from '@/components/common/forms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { setIsShowDialogEditThresholdBenefitTier } from '../../slices';
import { editThresholdBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';
import useEditThresholdBenefitTierConfig from '../config/EditThresholdBenefitTierConfig';
import { transformInfinityToZero } from '../organisms/DialogEditThresholdBenefitTier';
import { EditThresholdTierFormValues } from '../schema/editThresholdTier.schema';

const EditThresholdBenefitForm = () => {
  const methods = useFormContext<EditThresholdTierFormValues>();
  const { formState } = methods;
  const config = useEditThresholdBenefitTierConfig();
  const isLoadingEditThresholdBenefit = useAppSelector(
    (state) => state.memberShipSettings.isLoadingEditThresholdBenefit,
  );

  const { handleSubmit } = methods;
  const tierToEdit = useAppSelector((state) => state.memberShipSettings.tierToEdit);

  const selectMembershipBenefit = useAppSelector(
    (state) => state.memberShipSettings.selectedMembership,
  );

  const dispatch = useAppDispatch();

  const handleCloseDialog = () => {
    dispatch(setIsShowDialogEditThresholdBenefitTier(false));
  };

  console.log('tierToEdit', tierToEdit);
  const onSubmit = (data: EditThresholdTierFormValues) => {
    if (!selectMembershipBenefit) {
      toast.error('Please select a membership benefit');
      return;
    }

    if (tierToEdit.previousTier) {
      if (data.newMin < tierToEdit.previousTier.min) {
        console.log('error new min');
        methods.setError('newMin', {
          message: 'New min must be greater than previous tier min',
        });

        return;
      }
    }

    if (tierToEdit.nextTier) {
      if (data.newMax > tierToEdit.nextTier.max) {
        console.log('error new max');
        methods.setError('newMax', {
          message: 'New max must be less than next tier max',
        });
        return;
      }
    }

    dispatch(
      editThresholdBenefitAsyncThunk({
        axis: data.axis,
        oldMin: transformInfinityToZero(data.oldMin),
        oldMax: transformInfinityToZero(data.oldMax),
        newMin: transformInfinityToZero(data.newMin),
        newMax: transformInfinityToZero(data.newMax),
      }),
    )
      .unwrap()
      .then(() => {
        methods.reset();
        dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
        handleCloseDialog();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const renderSubmitButtonDefault = () => (
    <div className="flex justify-between gap-4 mt-6">
      <CommonTooltip content="Cancel and go back">
        <Button
          variant="outline"
          type="button"
          onClick={handleCloseDialog}
          className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
        >
          <Icons.circleArrowLeft className="h-5 w-5" />
        </Button>
      </CommonTooltip>

      <CommonTooltip content={formState.isSubmitting ? 'Submitting...' : 'Submit'}>
        <Button
          type="submit"
          disabled={!formState.isValid || formState.isSubmitting || formState.isValidating}
          className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {formState.isSubmitting || isLoadingEditThresholdBenefit ? (
            <Icons.spinner className="animate-spin h-5 w-5" />
          ) : (
            <Icons.check className="h-5 w-5" />
          )}
        </Button>
      </CommonTooltip>
    </div>
  );

  return (
    <form data-test="dialog-edit-threshold-benefit-tier" onSubmit={handleSubmit(onSubmit)}>
      <FormConfig
        fields={config}
        methods={methods}
        renderSubmitButton={renderSubmitButtonDefault}
        isShowSubmitButtonInstruction={true}
      />
    </form>
  );
};

export default EditThresholdBenefitForm;
