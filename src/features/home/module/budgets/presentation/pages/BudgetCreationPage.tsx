'use client';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { cn } from '@/shared/utils';
import { useAppDispatch } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Currency } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { FIREBASE_ICON_BUDGETS_PATH } from '../../constants';
import { createBudgetAsyncThunk } from '../../slices/actions';
import BudgetFieldForm from '../molecules';
import { BudgetCreationFormValues, budgetCreationSchema, defaultBudgetFormValue } from '../schema';

const BudgetCreationPage = () => {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const methods = useForm<BudgetCreationFormValues>({
    resolver: yupResolver(budgetCreationSchema),
    defaultValues: defaultBudgetFormValue,
    mode: 'onChange',
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = async (data: BudgetCreationFormValues) => {
    let formattedData = {
      ...data,
      fiscalYear: Number(data.fiscalYear),
    };

    if (data.totalExpense.toString().length > 13) {
      setError('totalExpense', {
        message: 'Total expense must be less than 13 digits',
        type: 'validate',
      });
      return;
    }

    if (data.totalIncome.toString().length > 13) {
      setError('totalIncome', {
        message: 'Total income must be less than 13 digits',
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
          estimatedTotalExpense: data.totalExpense,
          estimatedTotalIncome: data.totalIncome,
          description: data.description ?? '',
          currency: data.currency as Currency,
        },
        setError: setError,
      }),
    )
      .unwrap()
      .then(() => {
        router.push('/budgets');
      });
  };

  return (
    <FormProvider {...methods}>
      <div className={cn('w-full', isMobile ? 'px-4' : 'px-16 md:px-32 lg:px-64')}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Create New Budget</h1>
          <Button
            type="button"
            variant="ghost"
            className="p-2"
            aria-label="Delete budget"
            onClick={() => router.push('/budgets')}
          >
            <Trash2 className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BudgetFieldForm />
        </form>
      </div>
    </FormProvider>
  );
};

export default BudgetCreationPage;
