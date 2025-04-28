import { uploadToFirebase } from '@/shared/lib';
import { useAppDispatch } from '@/store';
import { Currency } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { FIREBASE_ICON_BUDGETS_PATH } from '../../constants';
import { createBudgetAsyncThunk } from '../../slices/actions';
import { BudgetFieldForm } from '../molecules';
import { BudgetCreationFormValues } from '../schema';
import { resetGetBudgetState } from '../../slices';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';

type Props = {
  methods: UseFormReturn<BudgetCreationFormValues>;
};
const BudgetCreation = ({ methods }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <BudgetFieldForm />
    </form>
  );
};

export default BudgetCreation;
