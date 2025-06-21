import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';
import { FormConfig, UploadField } from '@/components/common/forms';

const ImageUploadListFieldConfig = () => {
  const methods = useFormContext<EditMemberShipFormValues>();
  const { setValue } = methods;

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

  /**
   * Handles file changes for image uploads, converting the file to a Base64 string.
   * @param fieldName The name of the form field to update (e.g., 'inActiveIcon').
   * @param file The File object or null.
   */
  const handleFileUpload = (fieldName: keyof EditMemberShipFormValues, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Cast reader.result to string, as it will be a Data URL
        setValue(fieldName, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Set the value to an empty string if no file is selected
      setValue(fieldName, '');
    }
  };

  const renderSubmitButton = () => <></>;

  const fields = iconItems.map((item) => (
    <UploadField
      key={item.id}
      name={item.id as keyof EditMemberShipFormValues}
      label={item.label}
      onChange={(file) => handleFileUpload(item.id as keyof EditMemberShipFormValues, file)}
      placeholder={item.placeholder}
      previewShape="square"
    />
  ));

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default ImageUploadListFieldConfig;
