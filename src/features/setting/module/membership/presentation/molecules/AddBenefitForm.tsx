import { FormConfig } from '@/components/common/forms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { setIsShowDialogAddBenefitTier } from '../../slices';
import useAddBenefitTierFieldConfig from '../config/AddBenefitTierFieldConfig';
import { AddBenefitTierFormValues } from '../schema';

const AddBenefitForm = () => {
  const methods = useFormContext<AddBenefitTierFormValues>();
  const { formState } = methods;
  const config = useAddBenefitTierFieldConfig();
  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );

  const dispatch = useAppDispatch();

  const handleCloseDialog = () => {
    dispatch(setIsShowDialogAddBenefitTier(false));
  };

  const renderSubmitButtonDefault = () => (
    <TooltipProvider>
      <div className="flex justify-between gap-4 mt-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              type="button"
              onClick={handleCloseDialog}
              className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
            >
              <Icons.circleArrowLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cancel and go back</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              disabled={!formState.isValid || formState.isSubmitting || formState.isValidating}
              className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {formState.isSubmitting || isLoadingAddUpdateBenefitTier ? (
                <Icons.spinner className="animate-spin h-5 w-5" />
              ) : (
                <Icons.check className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {formState.isSubmitting || isLoadingAddUpdateBenefitTier ? 'Submiting...' : 'Submit'}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <FormConfig
      fields={config}
      methods={methods}
      renderSubmitButton={renderSubmitButtonDefault}
      isShowSubmitButtonInstruction={true}
    />
  );
};

export default AddBenefitForm;
