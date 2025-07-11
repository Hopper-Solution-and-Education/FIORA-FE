import { FormConfig } from '@/components/common/forms';
import UploadImageField from '@/components/common/forms/upload/UploadImageField';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const ImageUploadListFieldConfig = () => {
  const methods = useFormContext<EditMemberShipFormValues>();

  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );

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
      name={item.id}
      label={item.label}
      required
      previewShape="square"
      disabled={isLoadingUpsertMembership}
    />
  ));

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default ImageUploadListFieldConfig;
