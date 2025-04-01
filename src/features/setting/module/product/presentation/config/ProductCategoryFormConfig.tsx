'use client';

import GlobalIconSelect from '@/components/common/atoms/GlobalIconSelect';
import InputField from '@/components/common/atoms/InputField';
import TextareaField from '@/components/common/atoms/TextareaField';
import { KeyboardEvent, useCallback } from 'react';

const useProductCategoryFormConfig = () => {
  const removeLeadingZeros = useCallback((value: string): string => {
    return value.replace(/^0+(?=[1-9]|\.)/, '') || '0';
  }, []);

  const handleInputChange = useCallback(
    (e: string) => {
      let newValue = e.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
      if (newValue.includes('.')) {
        const [integerPart, decimalPart = ''] = newValue.split('.');
        newValue = `${integerPart.slice(0, 3)}.${decimalPart.slice(0, 2)}`; // Max 3 integer digits, 2 decimal digits
      } else {
        newValue = newValue.slice(0, 3); // Max 3 integer digits
      }

      newValue = removeLeadingZeros(newValue);
      return newValue;
    },
    [removeLeadingZeros],
  );

  const onKeyDownHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (
      isNaN(Number(e.key)) &&
      !['Backspace', 'Delete', '.', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      e.preventDefault();
    }
  }, []);

  const fields = [
    <GlobalIconSelect key="icon" name="icon" label="Icon" />,
    <InputField key="name" name="name" label="Name" />,
    <TextareaField key="description" name="description" label="Description" />,
    <InputField
      key="tax-rate"
      name="tax_rate"
      placeholder="0.00%"
      onChange={(e) => handleInputChange(e)}
      onKeyDown={onKeyDownHandler}
    />,
  ];

  return fields;
};

export default useProductCategoryFormConfig;
