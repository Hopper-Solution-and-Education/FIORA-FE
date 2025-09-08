import { FormConfig, TextareaField } from '@/components/common/forms';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const StoryTierInputFieldConfig = () => {
  const methods = useFormContext<EditMemberShipFormValues>();

  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );

  const fields = [
    <TextareaField
      key="story"
      name="story"
      className={cn('h-72', 'text-sm', methods.formState.errors?.story && 'border-red-500')}
      placeholder="Tier story"
      disabled={isLoadingUpsertMembership}
    />,
  ];

  const renderSubmitButton = () => {
    return <></>;
  };

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default StoryTierInputFieldConfig;
