import { FormConfig, TextareaField } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const StoryTierInputFieldConfig = () => {
  const methods = useFormContext<EditMemberShipFormValues>();

  const fields = [<TextareaField key="story" name="story" className="h-40" />];

  const renderSubmitButton = () => {
    return <></>;
  };

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default StoryTierInputFieldConfig;
