import { Loading } from '@/components/common/atoms';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useBudgetCreationLogic } from '../hooks';
import { BudgetFieldForm } from '../molecules';
import { BudgetCreationFormValues } from '../schema';

type Props = {
  methods: UseFormReturn<BudgetCreationFormValues>;
};

const BudgetCreation = ({ methods }: Props) => {
  const { year: budgetYear } = useParams() as { year: string };
  const { handleSubmit } = methods;
  const { handleGetBudgetByYearAndType, isLoadingGetBudgetById, onSubmit } =
    useBudgetCreationLogic();

  useEffect(() => {
    if (budgetYear) {
      handleGetBudgetByYearAndType();
    }
  }, [budgetYear]);

  return (
    <React.Fragment>
      {isLoadingGetBudgetById && <Loading />}
      <form data-test="budget-creation" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BudgetFieldForm />
      </form>
    </React.Fragment>
  );
};

export default BudgetCreation;
