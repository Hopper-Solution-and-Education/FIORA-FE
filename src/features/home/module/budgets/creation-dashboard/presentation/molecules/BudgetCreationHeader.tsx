/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteDialog } from '@/components/common/organisms';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { deleteBudgetAsyncThunk } from '../../slices/actions';
import { BudgetCreationFormValues } from '../schema';

const BudgetCreationHeader = () => {
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const { year: budgetYear } = useParams() as { year: string };
  const isLoading = useAppSelector((state) => state.budgetControl.isDeletingBudget);
  const dispatch = useAppDispatch();
  const { getValues } = useFormContext<BudgetCreationFormValues>();

  const handlePressDeleteBudget = useCallback(() => {
    setOpenDelete(true);
  }, []);

  const handlePressConfirmDeleteBudget = useCallback(() => {
    const budgetId = getValues('id');
    if (!budgetId) {
      toast.error('Budget ID is not found');
      return;
    }
    dispatch(deleteBudgetAsyncThunk({ budgetYear }))
      .unwrap()
      .then(() => {
        router.push('/budgets');
      });
  }, [budgetYear, dispatch]);

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl md:text-2xl font-bold">
        {budgetYear ? `Update Budget ${budgetYear}` : 'Create New Budget'}
      </h1>

      <Button
        disabled={!budgetYear}
        type="button"
        variant="ghost"
        className="p-2"
        aria-label="Delete budget"
        onClick={handlePressDeleteBudget}
      >
        <Trash2 className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
      </Button>

      <DeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        confirmText={`This action will delete budget for ${budgetYear}. Please ensure the Account Balance is verified for the rollback process.`}
        description="Click ← to stay back Or click V to confirm delete."
        onConfirm={handlePressConfirmDeleteBudget}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BudgetCreationHeader;
