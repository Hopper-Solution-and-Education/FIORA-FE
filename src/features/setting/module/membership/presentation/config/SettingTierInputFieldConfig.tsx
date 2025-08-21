import { FormConfig, SelectField } from '@/components/common/forms';
import { GlobalDialog } from '@/components/common/molecules';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { ProcessMembershipMode } from '../../data/api';
import { setIsShowDialogAddBenefitTier } from '../../slices';
import { deleteBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';
import SettingTierInputField from '../atoms/SettingTierInputField';
import { DynamicFieldTier, EditMemberShipFormValues } from '../schema/editMemberShip.schema';
import { formatLabel } from './AddBenefitTierFieldConfig';

const options = {
  percent: true,
  maxPercent: 100,
};

const deleteModes = [ProcessMembershipMode.DELETE, ProcessMembershipMode.DELETE_ALL];

const SettingTierInputFieldConfig = ({
  dynamicTierFields,
}: {
  dynamicTierFields: DynamicFieldTier[];
}) => {
  const methods = useFormContext<EditMemberShipFormValues>();
  const dispatch = useAppDispatch();
  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );
  const [isShowDialogDeleteBenefitTier, setIsShowDialogDeleteBenefitTier] = useState(false);
  const [idTierToDelete, setIdTierToDelete] = useState<string | null>(null);
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);
  const { setValue, watch } = methods;
  const isLoadingDeleteBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingDeleteBenefitTier,
  );

  const [deleteMode, setDeleteMode] = useState<ProcessMembershipMode>(ProcessMembershipMode.DELETE);

  // Debug logs
  console.log('🔍 Debug - SettingTierInputFieldConfig render:', {
    dynamicTierFields,
    fieldsCount: dynamicTierFields.length,
    formValues: methods.getValues(),
  });

  const handleOpenDialogAddBenefitTier = () => {
    dispatch(setIsShowDialogAddBenefitTier(true));
  };

  // Render dynamic fields based on configuration
  const fields = dynamicTierFields.map((field) => {
    const fieldValue = typeof watch(field.key) === 'number' ? (watch(field.key) as number) : 0;
    console.log('🔍 Debug - Rendering field:', {
      key: field.key,
      label: field.label,
      value: fieldValue,
      suffix: field.suffix,
    });

    return (
      <SettingTierInputField
        key={field.key}
        label={field.label}
        name={field.key}
        value={fieldValue}
        onChange={(value) => setValue(field.key, value)}
        suffix={field.suffix}
        options={options}
        required
        disabled={isLoadingUpsertMembership || isLoadingDeleteBenefitTier}
        showRemove={dynamicTierFields.length > 1}
        onRemove={() => {
          setIsShowDialogDeleteBenefitTier(true);
          setIdTierToDelete(field.id);
          setSlugToDelete(field.slug);
          setDeleteMode(ProcessMembershipMode.DELETE);
        }}
      />
    );
  });

  // Sticky submit button
  const renderSubmitButton = () => {
    return (
      <Button
        type="button"
        className="w-full mt-10"
        variant="outline"
        onClick={handleOpenDialogAddBenefitTier}
      >
        <Icons.add />
      </Button>
    );
  };

  return (
    <div className="relative">
      <div className="max-h-[400px] overflow-y-auto pr-2">
        <FormConfig fields={fields} methods={methods} renderSubmitButton={() => null} />
      </div>
      {renderSubmitButton()}
      <GlobalDialog
        open={isShowDialogDeleteBenefitTier}
        onOpenChange={() => setIsShowDialogDeleteBenefitTier(!isShowDialogDeleteBenefitTier)}
        renderContent={() => (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p>Are you sure you want to delete this benefit tier?</p>
              <p>This action cannot be undone.</p>
              <p>
                <span className="font-bold">Delete Mode:</span> {formatLabel(deleteMode)}
              </p>
            </div>
            <SelectField
              options={deleteModes.map((mode) => ({
                label: formatLabel(mode),
                value: mode,
              }))}
              value={deleteMode}
              required
              noneValue={false}
              onChange={(value) => setDeleteMode(value as ProcessMembershipMode)}
            />
          </div>
        )}
        customLeftButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsShowDialogDeleteBenefitTier(false)}
                className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                <Icons.circleArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cancel and go back</p>
            </TooltipContent>
          </Tooltip>
        }
        customRightButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  if (idTierToDelete) {
                    dispatch(
                      deleteBenefitAsyncThunk({
                        slug: slugToDelete || '',
                        tierId: idTierToDelete,
                        mode: deleteMode,
                      }),
                    )
                      .unwrap()
                      .then(() => {
                        dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
                        setIsShowDialogDeleteBenefitTier(false);
                      })
                      .catch((error) => {
                        toast.error(error);
                        setIsShowDialogDeleteBenefitTier(false);
                      });
                  }
                }}
                disabled={isLoadingDeleteBenefitTier}
                className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoadingDeleteBenefitTier ? (
                  <Icons.spinner className="animate-spin h-5 w-5" />
                ) : (
                  <Icons.check className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLoadingDeleteBenefitTier ? 'Submiting...' : 'Submit'}</p>
            </TooltipContent>
          </Tooltip>
        }
        isLoading={isLoadingDeleteBenefitTier}
      />
    </div>
  );
};

export default SettingTierInputFieldConfig;
