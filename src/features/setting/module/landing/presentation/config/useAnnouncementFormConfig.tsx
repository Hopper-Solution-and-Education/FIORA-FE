'use client';

import { InputField, TextareaField } from '@/components/common/forms';
import SwitchField from '@/components/common/forms/switch/SwitchField';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';

const useAnnouncementFormConfig = (index: number) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  const prefix = `announcements.${index}.`;

  const fields = [
    <InputField
      key={`${index}.title`}
      name={`${prefix}title`}
      label="Title"
      disabled={isSubmitting || isLoadingSaveChange}
    />,
    <TextareaField
      key={`${index}.content`}
      name={`${prefix}content`}
      label="Content"
      disabled={isSubmitting || isLoadingSaveChange}
    />,

    <SwitchField
      key={`${index}.isActive`}
      name={`${prefix}isActive`}
      label="Show on Homepage"
      disabled={isSubmitting || isLoadingSaveChange}
      activeLabel="Show"
      inactiveLabel="Hide"
    />,
  ];

  return fields;
};

export default useAnnouncementFormConfig;
