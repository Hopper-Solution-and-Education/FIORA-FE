'use client';

import {
  CustomDateTimePicker,
  InputCurrency,
  SelectField,
  TextareaField,
} from '@/components/common/forms';
import IconSelectUpload from '@/components/common/forms/select/IconSelectUpload';
import { Currency } from '@prisma/client';
import { useFormContext } from 'react-hook-form';
import { BudgetCreationFormValues } from '../schema';
import { useAppSelector } from '@/store';

const useBudgetFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext<BudgetCreationFormValues>();
  const isLoadingCreateBudget = useAppSelector((state) => state.budgetControl.isCreatingBudget);
  const isDisabledField = isSubmitting || isLoadingCreateBudget;

  const fields = [
    <IconSelectUpload key="icon" name="icon" required disabled={isDisabledField} />,
    <CustomDateTimePicker
      key="fiscalYear"
      name="fiscalYear"
      label="Fiscal Year"
      yearOnly
      required
      disabled={isDisabledField}
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
      key="price"
      name="totalExpense"
      label="Estimated Total Expense"
      currency={watch('currency')}
      required
      disabled={isDisabledField}
    />,
    <InputCurrency
      key="price"
      name="totalIncome"
      label="Estimated Total Income"
      currency={watch('currency')}
      required
      disabled={isDisabledField}
    />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Product Description"
      disabled={isDisabledField}
    />,
  ];

  return fields;
};

export default useBudgetFieldConfig;
