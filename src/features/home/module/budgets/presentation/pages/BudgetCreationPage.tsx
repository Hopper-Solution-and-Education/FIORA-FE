'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
// Assuming defaultBudgetFormValue is now correctly defined in schema.ts
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { cn } from '@/shared/utils';
import { Trash2 } from 'lucide-react';
import { BudgetFieldForm } from '../molecules';
import { BudgetCreationFormValues, budgetCreationSchema, defaultBudgetFormValue } from '../schema';

const BudgetCreationPage = () => {
  const isMobile = useIsMobile();
  const methods = useForm<BudgetCreationFormValues>({
    resolver: yupResolver(budgetCreationSchema),
    // Use the correct default values object for Budget
    defaultValues: defaultBudgetFormValue,
    mode: 'onChange',
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: BudgetCreationFormValues) => {
    console.log('====================================');
    console.log('Form Data:', data);
    console.log('====================================');
    // Implement your budget creation logic here (e.g., API call)
  };

  return (
    <FormProvider {...methods}>
      {/* Added Tailwind classes for responsiveness and styling */}

      <div className={cn('w-full', isMobile ? 'px-2' : 'px-48')}>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Create New Budget</h1>

          <Button type="button" variant="ghost">
            <Trash2 color="red" className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
          <BudgetFieldForm />
        </form>
      </div>
    </FormProvider>
  );
};

export default BudgetCreationPage;
