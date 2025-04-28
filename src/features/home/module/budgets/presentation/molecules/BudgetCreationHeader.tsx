import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const BudgetCreationHeader = () => {
  const router = useRouter();

  return (
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
  );
};

export default BudgetCreationHeader;
