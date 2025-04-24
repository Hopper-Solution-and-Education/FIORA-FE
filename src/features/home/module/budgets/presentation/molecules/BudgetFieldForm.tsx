'use client';
import { FormConfig } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';
import useBudgetFieldConfig from '../config/BudgetFieldConfig';
import { BudgetCreationFormValues } from '../schema';
import { useAppSelector } from '@/store';

const BudgetFieldForm = () => {
  const fields = useBudgetFieldConfig();
  const methods = useFormContext<BudgetCreationFormValues>();
  const isLoadingCreateBudget = useAppSelector((state) => state.budgetControl.isCreatingBudget);
  return (
    <>
      <FormConfig fields={fields} methods={methods} isLoading={isLoadingCreateBudget} />
    </>
  );
};

export default BudgetFieldForm;
