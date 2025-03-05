'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { BudgetForm } from './components/BudgetForm';
import { MobileTable } from './components/MobileTable';
import { MonthlyTable } from './components/MonthlyTable';
import { YearlyTable } from './components/YearlyTable';
import { useBudgetControl } from './hooks/useBudgetControl';

export default function BudgetControlPage() {
  const {
    totalExpense,
    setTotalExpense,
    totalIncome,
    setTotalIncome,
    showTable,
    editableValues,
    editing,
    isMobile,
    trueExpense,
    trueIncome,
    plannedIncome,
    halfYearlyAmount,
    monthlyAmount,
    monthlyIncome,
    handleEdit,
    toggleEdit,
    handleBlur,
    generateBudget,
  } = useBudgetControl();

  return (
    <div className="w-full mx-auto min-h-screen py-10 px-4 md:px-10">
      <Card className="w-full mx-auto overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calculator className="h-6 w-6" /> Budget Planner
          </CardTitle>
          <CardDescription>
            Enter your total expense and income to generate a budget breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm
            data={{ totalExpense, totalIncome }}
            actions={{ setTotalExpense, setTotalIncome, generateBudget }}
          />

          {showTable && (totalExpense > 0 || totalIncome > 0) && (
            <div className="mt-8 space-y-6 overflow-x-auto">
              {!isMobile ? (
                <>
                  <YearlyTable
                    data={{ editableValues, totalExpense }}
                    actions={{ handleEdit, toggleEdit, handleBlur }}
                    editing={editing}
                    halfYearlyAmount={halfYearlyAmount}
                  />

                  <div className="mt-8 space-y-6 overflow-x-auto">
                    <MonthlyTable
                      data={{ editableValues, plannedIncome, trueExpense, trueIncome }}
                      actions={{ handleEdit, toggleEdit, handleBlur }}
                      editing={editing}
                      monthlyAmount={monthlyAmount}
                      monthlyIncome={monthlyIncome}
                    />
                  </div>
                </>
              ) : (
                <MobileTable
                  data={{ editableValues, trueExpense }}
                  actions={{ handleEdit, toggleEdit, handleBlur }}
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
