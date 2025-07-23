import { FormConfig } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';
import { useAnnouncementFormConfig } from '../config';

interface AnnouncementFormProps {
  index: number;
}

const AnnouncementForm = ({ index }: AnnouncementFormProps) => {
  const methods = useFormContext();
  const fields = useAnnouncementFormConfig(index);

  const renderSubmitButton = () => <></>;

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default AnnouncementForm;
