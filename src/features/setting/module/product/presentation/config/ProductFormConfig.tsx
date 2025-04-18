'use client';

import {
  ArrayField,
  GlobalIconSelect,
  InputCurrency,
  InputField,
  SelectField,
  TextareaField,
} from '@/components/common/forms';
import IconSelectUpload from '@/components/common/forms/select/IconSelectUpload';
import { useAppDispatch, useAppSelector } from '@/store';
import { Currency, ProductType } from '@prisma/client';
import { KeyboardEvent, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  setIsOpenDialogAddCategory,
  setProductCategoryFormState,
  setProductCategoryToEdit,
} from '../../slices';

const useProductFormConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext();

  const { data } = useAppSelector((state) => state.productManagement.categories);
  const dispatch = useAppDispatch();
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

  const handleOpenDialog = () => {
    dispatch(setIsOpenDialogAddCategory(true));
    dispatch(setProductCategoryFormState('add'));
    dispatch(setProductCategoryToEdit(null));
  };

  const fields = [
    <IconSelectUpload key="icon" name="icon" required disabled={isSubmitting} />,
    <SelectField
      options={data.map((item) => ({ label: item.name, value: item.id, icon: item.icon }))}
      key="catId"
      name="catId"
      label="Category"
      disabled={isSubmitting}
      onCustomAction={handleOpenDialog}
      customActionLabel="Add New"
    />,
    <InputField key="name" name="name" placeholder="Product Name" label="Name" required />,
    <SelectField
      options={Object.entries(ProductType).map(([key, value]) => ({
        label: key,
        value,
      }))}
      key="type"
      name="type"
      label="Type"
      required
      disabled={isSubmitting}
    />,
    <SelectField
      options={Object.entries(Currency).map(([key, value]) => ({ label: key, value }))}
      key="currency"
      name="currency"
      label="Currency"
      placeholder="Select Currency"
      required
      disabled={isSubmitting}
    />,
    <InputCurrency
      key="price"
      name="price"
      label="Price"
      currency={watch('currency') ?? 'vnd'}
      required
      disabled={isSubmitting}
    />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Product Description"
      disabled={isSubmitting}
    />,
    <InputField
      key="taxRate"
      name="taxRate"
      placeholder="0.00%"
      label="Tax Rate"
      onChange={(e) => handleInputChange(e)}
      onKeyDown={onKeyDownHandler}
      onFocus={(e: React.FocusEvent<HTMLInputElement, Element>) => {
        if (e.target.value === '0') {
          e.target.value = '';
        }
      }}
      required
      disabled={isSubmitting}
    />,
    <ArrayField
      label="Product Items"
      key="items"
      name="items"
      emptyItem={{ name: '', description: '', icon: '' }}
      fields={[
        <InputField
          name="name"
          placeholder="Name"
          key="name"
          label="Product Item Name"
          required
          disabled={isSubmitting}
        />,
        <TextareaField
          name="description"
          placeholder="Product Item Description"
          key="description"
          label="Description"
          disabled={isSubmitting}
        />,
        <GlobalIconSelect
          name="icon"
          key="icon"
          label="Item Icon"
          required
          disabled={isSubmitting}
        />,
      ]}
    />,
  ];

  return fields;
};

export default useProductFormConfig;
