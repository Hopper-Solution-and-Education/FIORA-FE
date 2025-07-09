import { FormConfig } from '@/components/common/forms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { setIsShowDialogAddBenefitTier } from '../../slices';
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
  const { setValue, watch } = methods;

  const handleOpenDialogAddBenefitTier = () => {
    dispatch(setIsShowDialogAddBenefitTier(true));
  };

  // Render dynamic fields based on configuration
  const fields = dynamicTierFields.map((field) => (
    <SettingTierInputField
      key={field.key}
      label={field.label}
      name={field.key}
      value={typeof watch(field.key) === 'number' ? (watch(field.key) as number) : 0}
      onChange={(value) => setValue(field.key, value)}
      suffix={field.suffix}
      options={options}
      required
      disabled={isLoadingUpsertMembership}
      showRemove={dynamicTierFields.length > 1}
      onRemove={() => {
        console.log('remove');
      }}
    />
  ));

  // Sticky submit button
  const renderSubmitButton = () => {
    return (
      <Button
        type="button"
        className="w-full mt-1"
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
    </div>
  );
};

export default SettingTierInputFieldConfig;
