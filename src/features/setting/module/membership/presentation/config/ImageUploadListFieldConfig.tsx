import { FormConfig } from '@/components/common/forms';
import UploadImageField from '@/components/common/forms/upload/UploadImageField';
import { useFormContext } from 'react-hook-form';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const ImageUploadListFieldConfig = () => {
  const methods = useFormContext<EditMemberShipFormValues>();

  const iconItems = [
    {
      id: 'inActiveIcon',
      name: 'Inactive Icon',
      label: 'Inactive Icon',
      placeholder: 'Choose Inactive Icon',
    },
    {
      id: 'activeIcon',
      name: 'Passed Icon',
      label: 'Passed Icon',
      placeholder: 'Choose Passed Icon',
    },
    {
      id: 'themeIcon',
      name: 'Theme Icon',
      label: 'Theme Icon',
      placeholder: 'Choose Theme Icon',
    },
  ];

  const renderSubmitButton = () => <></>;

  const fields = iconItems.map((item) => (
    <UploadImageField
      key={item.id}
      name={item.id as keyof EditMemberShipFormValues}
      label={item.label}
      required
      previewShape="square"
    />
  ));

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default ImageUploadListFieldConfig;
