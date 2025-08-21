'use client';

import {
  CustomDateTimePicker,
  InputCurrency,
  SelectField,
  TextareaField,
} from '@/components/common/forms';
import IconSelectUpload from '@/components/common/forms/select/IconSelectUpload';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppSelector } from '@/store';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { BudgetCreationFormValues } from '../schema';

const useBudgetFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext<BudgetCreationFormValues>();
  const { year: budgetYear } = useParams() as { year: string };
  const isLoadingCreateBudget = useAppSelector((state) => state.budgetControl.isCreatingBudget);
  const isDisabledField = isSubmitting || isLoadingCreateBudget;
  const currentYear = new Date().getFullYear();

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

  const fields = [
    <IconSelectUpload key="icon" name="icon" required disabled={isDisabledField} />,
    <CustomDateTimePicker
      key="fiscalYear"
      name="fiscalYear"
      label="Fiscal Year"
      yearOnly
      required
      disabled={isDisabledField || !!budgetYear}
      isYearDisabled={(year) => (budgetYear ? false : year < currentYear)}
    />,
    <SelectField
      options={currencyOptions}
      key="currency"
      name="currency"
      label="Currency"
      placeholder="Select Currency"
      disabled={isDisabledField || !!budgetYear}
      noneValue={false}
    />,
    <InputCurrency
      key="estimatedTotalExpense"
      name="estimatedTotalExpense"
      label="Estimated Total Expense"
      currency={watch('currency') || 'VND'}
      maxLength={11}
      // required
      disabled={isDisabledField}
      showSuggestion
      mode="onChange"
    />,
    <InputCurrency
      key="estimatedTotalIncome"
      name="estimatedTotalIncome"
      label="Estimated Total Income"
      currency={watch('currency') || 'VND'}
      maxLength={11}
      // required
      disabled={isDisabledField}
      showSuggestion
      mode="onChange"
    />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Budget Description"
      disabled={isDisabledField}
    />,
  ];

  return fields;
};

export default useBudgetFieldConfig;
