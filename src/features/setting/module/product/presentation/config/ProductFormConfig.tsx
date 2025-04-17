'use client';

import { InputCurrency, InputField, TextareaField } from '@/components/common/forms';
import { KeyboardEvent, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Product } from '../../domain/entities';
import {
  ProductCategoryField,
  ProductIconField,
  ProductItemsField,
  ProductTypeField,
} from '../atoms';
import { ProductFormValues } from '../schema';

type props = {
  productToEdit: Product | null;
};

const useProductFormConfig = ({ productToEdit }: props) => {
  const { control } = useFormContext<ProductFormValues>();

  const removeLeadingZeros = useCallback((value: string): string => {
    return value.replace(/^0+(?=[1-9]|\.)/, '') || '0';
  }, []);

  const handleInputChange = useCallback(
    (e: string) => {
      let newValue = e.replace(/[^0-9.]/g, '');
      if (newValue.includes('.')) {
        const [integerPart, decimalPart = ''] = newValue.split('.');
        newValue = `${integerPart.slice(0, 3)}.${decimalPart.slice(0, 2)}`;
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
    <ProductIconField key="icon" control={control} productToEdit={productToEdit} />,
    <InputField key="name" name="name" label="Name" required />,
    <ProductTypeField key="product-type" control={control} />,
    <ProductCategoryField key="catId" control={control} />,
    <InputCurrency key="price" name="price" label="price" currency={'vnd'} />,
    <TextareaField key="description" name="description" label="Description" />,
    <InputField
      key="tax-rate"
      name="tax_rate"
      placeholder="0.00%"
      label="Tax Rate"
      onChange={(e) => handleInputChange(e)}
      onKeyDown={onKeyDownHandler}
      required
    />,
    <ProductItemsField key="product-item" control={control} />,
  ];

  return fields;
};

export default useProductFormConfig;
