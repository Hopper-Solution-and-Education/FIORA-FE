import { Loading } from '@/components/common/atoms';
import { uploadToFirebase } from '@/shared/lib';
import { useAppDispatch } from '@/store';
import { Currency } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import {
  FIREBASE_ICON_BUDGETS_PATH,
  MAX_NUMBER_OF_DIGITS_FOR_BUDGET_AMOUNT,
} from '../../constants';
import { budgetDIContainer } from '../../di/budgetDIContainer';
import { TYPES } from '../../di/budgetDIContainer.type';
import { IGetBudgetByIdUseCase } from '../../domain/usecases';
import { resetGetBudgetState } from '../../slices';
import { createBudgetAsyncThunk, getBudgetAsyncThunk } from '../../slices/actions';
import { BudgetFieldForm } from '../molecules';
import { BudgetCreationFormValues } from '../schema';

type Props = {
  methods: UseFormReturn<BudgetCreationFormValues>;
};

const BudgetCreation = ({ methods }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { year: budgetYear } = useParams() as { year: string };
  const { handleSubmit, setError, reset } = methods;
  const [isLoadingGetBudgetById, setIsLoadingGetBudgetById] = useState(false);

  const handleGetBudgetById = async () => {
    try {
      setIsLoadingGetBudgetById(true);
      const getBudgetByIdUseCase = budgetDIContainer.get<IGetBudgetByIdUseCase>(
        TYPES.IGetBudgetByIdUseCase,
      );

      const budget = await getBudgetByIdUseCase.execute({ fiscalYear: budgetYear, type: 'Top' });

      reset({
        icon: budget.icon,
        fiscalYear: String(budget.fiscalYear),
        currency: budget.currency,
        estimatedTotalExpense: budget.estimatedTotalExpense,
        estimatedTotalIncome: budget.estimatedTotalIncome,
        description: budget.description,
      });
    } catch (error) {
      toast.error('Failed to get budget by id', {
        description: (error as Error).message,
      });
    } finally {
      setIsLoadingGetBudgetById(false);
    }
  };

  useEffect(() => {
    if (budgetYear) {
      handleGetBudgetById();
    }
  }, [budgetYear]);

  const onSubmit = async (data: BudgetCreationFormValues) => {
    let formattedData = {
      ...data,
      fiscalYear: Number(data.fiscalYear),
    };

    if (data.estimatedTotalExpense.toString().length > MAX_NUMBER_OF_DIGITS_FOR_BUDGET_AMOUNT) {
      setError('estimatedTotalExpense', {
        message: 'Total expense must be less than 11 digits',
        type: 'validate',
      });
      return;
    }

    if (data.estimatedTotalIncome.toString().length > MAX_NUMBER_OF_DIGITS_FOR_BUDGET_AMOUNT) {
      setError('estimatedTotalIncome', {
        message: 'Total income must be less than 11 digits',
        type: 'validate',
      });
      return;
    }

    if (formattedData.icon && formattedData.icon.startsWith('blob:')) {
      const response = await fetch(formattedData.icon);
      const blob = await response.blob();
      const fileName = `${formattedData.fiscalYear.toString().replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
      const file = new File([blob], fileName, { type: blob.type });

      const firebaseUrl = await uploadToFirebase({
        file,
        path: FIREBASE_ICON_BUDGETS_PATH,
        fileName,
      });

      formattedData = { ...formattedData, icon: firebaseUrl };
    }

    await dispatch(
      createBudgetAsyncThunk({
        data: {
          icon: data.icon,
          fiscalYear: data.fiscalYear,
          estimatedTotalExpense: data.estimatedTotalExpense,
          estimatedTotalIncome: data.estimatedTotalIncome,
          description: data.description ?? '',
          currency: data.currency as Currency,
        },
        setError: setError,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(resetGetBudgetState());
        dispatch(
          getBudgetAsyncThunk({
            cursor: null,
            search: '',
            take: 3,
          }),
        );
        router.replace('/budgets');
      });
  };
  return (
    <React.Fragment>
      {isLoadingGetBudgetById && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BudgetFieldForm />
      </form>
    </React.Fragment>
  );
};

export default BudgetCreation;
