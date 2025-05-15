import { uploadToFirebase } from '@/shared/lib';
import { Currency } from '@/shared/types';
import { useAppDispatch } from '@/store';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import {
  FIREBASE_ICON_BUDGETS_PATH,
  MAX_NUMBER_OF_DIGITS_FOR_BUDGET_AMOUNT,
} from '../../constants';
import { budgetDIContainer } from '../../di/budgetDIContainer';
import { TYPES } from '../../di/budgetDIContainer.type';
import { IGetBudgetByYearAndTypeUseCase } from '../../domain/usecases';
import { resetGetBudgetState } from '../../slices';
import {
  createBudgetAsyncThunk,
  getBudgetAsyncThunk,
  updateBudgetAsyncThunk,
} from '../../slices/actions';
import { BudgetCreationFormValues } from '../schema';

export const useBudgetCreationLogic = () => {
  const [isLoadingGetBudgetById, setIsLoadingGetBudgetById] = useState(false);
  const methods = useFormContext<BudgetCreationFormValues>();
  const { reset, setError } = methods;
  const { year: budgetYear } = useParams() as { year: string };
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get the budget by id
  const handleGetBudgetByYearAndType = useCallback(async () => {
    try {
      setIsLoadingGetBudgetById(true);
      const getBudgetByYearAndTypeUseCase = budgetDIContainer.get<IGetBudgetByYearAndTypeUseCase>(
        TYPES.IGetBudgetByYearAndTypeUseCase,
      );

      const budget = await getBudgetByYearAndTypeUseCase.execute({
        fiscalYear: budgetYear,
        type: 'Top',
      });

      reset({
        id: budget.id,
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
  }, [budgetYear]);

  // Submit the budget
  const onSubmit = useCallback(
    async (data: BudgetCreationFormValues) => {
      let formattedData = {
        ...data,
        fiscalYear: Number(data.fiscalYear),
      };

      // Validate the estimated total expense and income
      if (data.estimatedTotalExpense.toString().length > MAX_NUMBER_OF_DIGITS_FOR_BUDGET_AMOUNT) {
        setError('estimatedTotalExpense', {
          message: 'Total expense must be less than 11 digits',
          type: 'validate',
        });
        return;
      }

      // Validate the estimated total income
      if (data.estimatedTotalIncome.toString().length > MAX_NUMBER_OF_DIGITS_FOR_BUDGET_AMOUNT) {
        setError('estimatedTotalIncome', {
          message: 'Total income must be less than 11 digits',
          type: 'validate',
        });
        return;
      }

      // Validate the icon
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

      // Update the budget
      if (budgetYear) {
        await dispatch(
          updateBudgetAsyncThunk({
            data: {
              budgetYear,
              currency: data.currency as Currency,
              description: data.description ?? '',
              estimatedTotalExpense: data.estimatedTotalExpense,
              estimatedTotalIncome: data.estimatedTotalIncome,
              fiscalYear: Number(data.fiscalYear),
              icon: data.icon,
              type: 'Top',
            },
            setError: setError,
          }),
        )
          .unwrap()
          .then(() => {
            router.back();
          });
      } else {
        // Create the budget
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
      }
    },
    [budgetYear],
  );

  return {
    isLoadingGetBudgetById,
    handleGetBudgetByYearAndType,
    onSubmit,
  };
};
