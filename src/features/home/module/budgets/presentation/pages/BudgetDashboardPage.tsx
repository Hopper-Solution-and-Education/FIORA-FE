'use client';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { resetGetBudgetState } from '../../slices';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';
import { BudgetDashboardHeader } from '../molecules';
import { BudgetDashboard } from '../organisms';
import { BudgetGetFormValues, budgetGetSchema, defaultBudgeGetFormValue } from '../schema';

const BudgetDashboardPage = () => {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.settings.currency);

  const { isLoading, budgets } = useAppSelector((state) => state.budgetControl.getBudget);

  const methods = useForm<BudgetGetFormValues>({
    resolver: yupResolver(budgetGetSchema),
    defaultValues: defaultBudgeGetFormValue,
    mode: 'onChange',
  });

  const { getValues } = methods;

  useEffect(() => {
    handleGetBudgetData(null);
  }, []);

  const handleGetBudgetData = useCallback((cursor: number | null, handleNext?: () => void) => {
    if (isLoading || budgets.length > 0) return;
    dispatch(resetGetBudgetState());
    dispatch(
      getBudgetAsyncThunk({
        cursor,
        search: getValues('search') || '',
        take: 3,
        filters: {
          fiscalYear: {
            lte: Number(getValues('toYear')),
            gte: Number(getValues('fromYear')),
          },
        },
        currency,
      }),
    ).then(handleNext);
  }, []);

  return (
    <div className="p-6">
      <FormProvider {...methods}>
        <BudgetDashboardHeader />
        <BudgetDashboard handleGetBudgetData={handleGetBudgetData} />
      </FormProvider>
    </div>
  );
};

export default BudgetDashboardPage;
