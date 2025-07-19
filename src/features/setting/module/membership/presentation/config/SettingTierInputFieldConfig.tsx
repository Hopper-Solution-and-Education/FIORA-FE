import { FormConfig } from '@/components/common/forms';
import { GlobalDialog } from '@/components/common/molecules';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { setIsShowDialogAddBenefitTier } from '../../slices';
import { deleteBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';
import SettingTierInputField from '../atoms/SettingTierInputField';
import { DynamicFieldTier, EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const options = {
  percent: true,
  maxPercent: 100,
};

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
  const { setValue, watch } = methods;
  const isLoadingDeleteBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingDeleteBenefitTier,
  );

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
        heading="Delete Benefit Tier"
        description="Are you sure you want to delete this benefit tier?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isLoadingDeleteBenefitTier}
        onConfirm={() => {
          if (idTierToDelete) {
            dispatch(deleteBenefitAsyncThunk({ id: idTierToDelete }))
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
      />
    </div>
  );
};

export default SettingTierInputFieldConfig;
