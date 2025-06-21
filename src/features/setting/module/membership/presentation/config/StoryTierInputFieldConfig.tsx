import { FormConfig, TextareaField } from '@/components/common/forms';
import { cn } from '@/shared/utils';
import { useFormContext } from 'react-hook-form';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const StoryTierInputFieldConfig = () => {
  const methods = useFormContext<EditMemberShipFormValues>();

  const fields = [
    <TextareaField
      key="story"
      name="story"
      className={cn(
        'h-full min-h-44',
        'text-sm',
        'sm:text-sm',
        'md:text-base',
        'lg:text-md',
        methods.formState.errors?.story && 'border-red-500',
      )}
      placeholder="Tier story"
    />,
  ];

  const renderSubmitButton = () => {
    return <></>;
  };

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default StoryTierInputFieldConfig;
