/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { isLoading, budgets } = useAppSelector((state) => state.budgetControl.getBudget);

  const methods = useForm<BudgetGetFormValues>({
    resolver: yupResolver(budgetGetSchema),
    defaultValues: defaultBudgeGetFormValue,
    mode: 'onChange',
  });

  const { getValues } = methods;

  useEffect(() => {
    dispatch(resetGetBudgetState());
    handleGetBudgetData(null);
  }, [pathname]);

  const handleGetBudgetData = useCallback((cursor: string | null, handleNext?: () => void) => {
    if (isLoading || budgets.length > 0) return;
    dispatch(resetGetBudgetState());
    dispatch(
      getBudgetAsyncThunk({
        cursor,
        search: getValues('search') || '',
        take: 3,
        filters: {
          fiscalYear: {
            lte: String(getValues('toYear') ?? 9999),
            gte: String(getValues('fromYear') ?? 0),
          },
        },
        currency,
      }),
    ).then(handleNext);
  }, []);

  return (
    <FormProvider {...methods}>
      <div className="p-6">
        <BudgetDashboardHeader />
        <BudgetDashboard />
      </div>
    </FormProvider>
  );
};

export default BudgetDashboardPage;
