'use client';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { cn } from '@/shared/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { BudgetCreationHeader } from '../molecules';
import { BudgetCreation } from '../organisms';
import { BudgetCreationFormValues, budgetCreationSchema, defaultBudgetFormValue } from '../schema';

const BudgetCreationPage = () => {
  const isMobile = useIsMobile();
  const methods = useForm<BudgetCreationFormValues>({
    resolver: yupResolver(budgetCreationSchema),
    defaultValues: defaultBudgetFormValue,
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <div className={cn('w-full', isMobile ? 'px-4' : 'px-16 md:px-32 lg:px-52')}>
        <BudgetCreationHeader />
        <BudgetCreation methods={methods} />
      </div>
    </FormProvider>
  );
};

export default BudgetCreationPage;
