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

const useBudgetFieldConfig = () => {
  const {
    formState: { isSubmitting },
    watch,
  } = useFormContext<BudgetCreationFormValues>();

  const fields = [
    <IconSelectUpload key="icon" name="icon" required disabled={isSubmitting} />,
    <CustomDateTimePicker
      key="fiscalYear"
      name="fiscalYear"
      label="Fiscal Year"
      yearOnly
      required
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
      name="totalExpense"
      label="Estimated Total Expense"
      currency={watch('currency')}
      required
      disabled={isSubmitting}
    />,
    <InputCurrency
      key="price"
      name="totalIncome"
      label="Estimated Total Income"
      currency={watch('currency')}
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
  ];

  return fields;
};

export default useBudgetFieldConfig;
