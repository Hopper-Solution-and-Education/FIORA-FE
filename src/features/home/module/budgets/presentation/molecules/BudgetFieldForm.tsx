'use client';
import { FormConfig } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';
import useBudgetFieldConfig from '../config/BudgetFieldConfig';
import { BudgetCreationFormValues } from '../schema';

const BudgetFieldForm = () => {
  const fields = useBudgetFieldConfig();
  const methods = useFormContext<BudgetCreationFormValues>();
  return (
    <>
      <FormConfig fields={fields} methods={methods} />
    </>
  );
};

export default BudgetFieldForm;
