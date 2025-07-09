import { FormConfig } from '@/components/common/forms';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import SettingTierInputField from '../atoms/SettingTierInputField';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const options = {
  percent: true,
  maxPercent: 100,
};

const SettingTierInputFieldConfig = ({
  dynamicTierFields,
}: {
  dynamicTierFields: { key: string; label: string; suffix?: string }[];
}) => {
  const methods = useFormContext<EditMemberShipFormValues>();
  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );
  const { setValue, watch } = methods;

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
    />
  ));

  const renderSubmitButton = () => {
    return <></>;
  };

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default SettingTierInputFieldConfig;
