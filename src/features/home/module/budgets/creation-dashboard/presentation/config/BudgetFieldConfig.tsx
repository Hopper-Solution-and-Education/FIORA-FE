'use client';

import {
  CustomDateTimePicker,
  InputCurrency,
  SelectField,
  TextareaField,
} from '@/components/common/forms';
import IconSelectUpload from '@/components/common/forms/select/IconSelectUpload';
import { useAppSelector } from '@/store';
import { Currency } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { BudgetCreationFormValues } from '../schema';

const useBudgetFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext<BudgetCreationFormValues>();
  const isLoadingCreateBudget = useAppSelector((state) => state.budgetControl.isCreatingBudget);
  const isDisabledField = isSubmitting || isLoadingCreateBudget;
  const currentYear = new Date().getFullYear();
  const { year: budgetYear } = useParams() as { year: string };

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
      options={Object.entries(Currency).map(([key, value]) => ({ label: key, value }))}
      key="currency"
      name="currency"
      label="Currency"
      placeholder="Select Currency"
      required
      disabled={isDisabledField}
    />,
    <InputCurrency
      key="estimatedTotalExpense"
      name="estimatedTotalExpense"
      label="Estimated Total Expense"
      currency={watch('currency') || 'VND'}
      maxLength={11}
      required
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
      required
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
