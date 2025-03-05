import dynamic from 'next/dynamic';
import React from 'react';
import { Separator } from '@/components/ui/separator';

const ExpenseIncomeSettingPageRender = dynamic(
  () => import('@/features/setting/presentation/module/expenseIncome/ExpenseIncomeSettingPage'),
  {
    loading: () => <div>Loading...</div>,
  },
);

const ExpenseIncomePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Expense And Income Setting</h3>
        <p className="text-sm text-muted-foreground">
          Update your expense and income settings. Set your preferred currency and other settings.
        </p>
      </div>
      <Separator />
      <ExpenseIncomeSettingPageRender />
    </div>
  );
};

export default ExpenseIncomePage;
