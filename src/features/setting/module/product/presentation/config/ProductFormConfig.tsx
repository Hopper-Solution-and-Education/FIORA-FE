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
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { RootState } from '@/store/rootReducer';
import { ProductType } from '@prisma/client';
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  setDeletedItems,
  setIsOpenDialogAddCategory,
  setProductCategoryFormState,
  setProductCategoryToEdit,
} from '../../slices';

const useProductFormConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext();

  const { data } = useAppSelector((state: RootState) => state.productManagement.categories);
  const deletedItems = useAppSelector((state: RootState) => state.productManagement.deletedItems);
  const dispatch = useAppDispatch();

  const { exchangeRates } = useCurrencyFormatter();
  // Generate options from fetched data or fallback to default
  const currencyOptions = useMemo(() => {
    if (Object.keys(exchangeRates).length > 0) {
      // Map the fetched data to the expected format using the correct API structure
      return Object.keys(exchangeRates)
        .filter((currency) => currency !== 'FX')
        .map((currency) => ({
          value: currency, // Use 'name' field (USD, VND, FX)
          label: `${currency} (${exchangeRates[currency].suffix})`, // Show both name and symbol
        }));
    }

    // Fallback to default options if data is not available
    return [{ value: 'none', label: 'No currencies available', disabled: true }];
  }, [exchangeRates]);

  const handleOpenDialog = () => {
    dispatch(setIsOpenDialogAddCategory(true));
    dispatch(setProductCategoryFormState('add'));
    dispatch(setProductCategoryToEdit(null));
  };

  const handleDelete = useCallback(
    (item: any) => {
      dispatch(setDeletedItems([...deletedItems, item.itemId]));
    },
    [deletedItems],
  );

  const fields = [
    <IconSelectUpload
      data-test="product-icon-field"
      key="icon"
      name="icon"
      required
      disabled={isSubmitting}
    />,
    <SelectField
      data-test="product-category-field"
      options={data.map((item: any) => ({ label: item.name, value: item.id, icon: item.icon }))}
      key="catId"
      name="catId"
      label="Category"
      disabled={isSubmitting}
      onCustomAction={handleOpenDialog}
      customActionLabel="Add New"
      required
    />,
    // <DateRangeFromToPickerField
    //   key="dateRange"
    //   name="dateRange"
    //   nameFrom="startDate"
    //   nameTo="endDate"
    //   labelFrom="Start Date"
    //   labelTo="End Date"
    //   requiredFrom
    //   requiredTo
    // />,
    <InputField
      data-test="product-name-field"
      key="name"
      name="name"
      placeholder="Product Name"
      label="Name"
      required
    />,
    <SelectField
      data-test="product-type-field"
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
      data-test="product-currency-field"
      options={currencyOptions}
      key="currency"
      name="currency"
      label="Currency"
      placeholder="Select Currency"
      required
      disabled={isSubmitting}
    />,
    <InputCurrency
      data-test="product-price-field"
      key="price"
      name="price"
      label="Price"
      currency={watch('currency') || CURRENCY.USD}
      required
      disabled={isSubmitting}
    />,
    <TextareaField
      data-test="product-description-field"
      key="description"
      name="description"
      label="Description"
      placeholder="Product Description"
      disabled={isSubmitting}
    />,
    <InputField
      data-test="product-tax-rate-field"
      key="taxRate"
      name="taxRate"
      placeholder="0.00%"
      label="Tax Rate"
      disabled={isSubmitting}
      options={{
        percent: true,
        maxPercent: 100,
      }}
    />,
    <ArrayField
      data-test="product-items-field"
      label="Product Items"
      key="items"
      name="items"
      emptyItem={{ name: '', description: '', icon: '' }}
      handleDelete={handleDelete}
      fields={[
        <GlobalIconSelect
          data-test="product-item-icon-field"
          name="icon"
          key="icon"
          label="Item Icon"
          required
          disabled={isSubmitting}
        />,
        <InputField
          data-test="product-item-name-field"
          name="name"
          placeholder="Name"
          key="name"
          label="Product Item Name"
          required
          disabled={isSubmitting}
        />,
        <TextareaField
          data-test="product-item-description-field"
          name="description"
          placeholder="Product Item Description"
          key="description"
          label="Description"
          disabled={isSubmitting}
        />,
      ]}
    />,
  ];

  return fields;
};

export default useProductFormConfig;
