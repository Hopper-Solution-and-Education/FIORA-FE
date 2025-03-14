'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store';
import { Calculator } from 'lucide-react';
import { BudgetForm } from './components/BudgetForm';
import { MobileTable } from './components/MobileTable';
import { MonthlyTable } from './components/MonthlyTable';
import { YearlyTable } from './components/YearlyTable';
import { useBudgetControl } from './hooks/useBudgetControl';
import { QuarterTable } from './components/QuarterTable';

export default function BudgetControlPage() {
  const { isMobile, halfYearlyAmount, monthlyAmount, monthlyIncome, quarterlyAmount } =
    useBudgetControl();
  const {
    totalExpense,
    totalIncome,
    showTable,
    editableValues,
    editing,
    trueExpense,
    trueIncome,
    plannedIncome,
  } = useAppSelector((state) => state.budget);

  return (
    <div className="w-full mx-auto min-h-screen py-10 px-4 md:px-10">
      <Card className="w-full mx-auto overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6" /> Budget Control
          </CardTitle>
          <CardDescription>
            Enter your total expense and income to generate a budget breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm data={{ totalExpense, totalIncome }} />

          {showTable && (totalExpense > 0 || totalIncome > 0) && (
            <div className="mt-8 space-y-6 overflow-x-auto">
              {!isMobile ? (
                <>
                  <YearlyTable
                    data={{ editableValues }}
                    editing={editing}
                    halfYearlyAmount={halfYearlyAmount}
                  />
                  <QuarterTable />
                  <div className="mt-8 space-y-6 overflow-x-auto">
                    <MonthlyTable
                      data={{ editableValues, plannedIncome, trueExpense, trueIncome }}
                      editing={editing}
                      monthlyAmount={monthlyAmount}
                      monthlyIncome={monthlyIncome}
                    />
                  </div>
                </>
              ) : (
                <MobileTable
                  data={{ editableValues, trueExpense }}
                  editing={editing}
                  monthlyAmount={monthlyAmount}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
