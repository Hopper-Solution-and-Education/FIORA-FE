'use client';

import { GlobalIconSelect, InputField, TextareaField } from '@/components/common/forms';
import { KeyboardEvent, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

const useProductCategoryFormConfig = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

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
    <GlobalIconSelect
      data-test="category-icon-field"
      key="icon"
      name="icon"
      label="Icon"
      required
      disabled={isSubmitting}
    />,
    <InputField
      data-test="category-name-input"
      key="name"
      name="name"
      label="Name"
      placeholder="Category Name"
      required
      disabled={isSubmitting}
    />,
    <TextareaField
      data-test="category-description-input"
      key="description"
      name="description"
      label="Description"
      placeholder="Category Description"
      disabled={isSubmitting}
    />,
    <InputField
      data-test="category-tax-rate-input"
      key="tax-rate"
      name="tax_rate"
      placeholder="0.00%"
      label="Tax Rate"
      onChange={(e) => handleInputChange(e)}
      onKeyDown={onKeyDownHandler}
      required
      disabled={isSubmitting}
      options={{
        percent: true,
        maxPercent: 100,
      }}
    />,
  ];

  return fields;
};

export default useProductCategoryFormConfig;
