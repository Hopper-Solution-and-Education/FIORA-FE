import { DeleteDialog } from '@/components/common/organisms';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const BudgetCreationHeader = () => {
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const { year: budgetYear } = useParams() as { year: string };

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
        onClick={() => setOpenDelete(true)}
      >
        <Trash2 className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
      </Button>

      <DeleteDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        confirmText="You are going to rollback the budgets. Please ensure the Account Balance for rollback process!"
        description="Click ← to stay back Or click V to confirm delete."
        onConfirm={() => router.push('/budgets')}
      />
    </div>
  );
};

export default BudgetCreationHeader;
