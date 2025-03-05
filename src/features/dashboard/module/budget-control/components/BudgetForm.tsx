'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { BudgetActions, BudgetData } from '../types/budget';

interface BudgetFormProps {
  data: Pick<BudgetData, 'totalExpense' | 'totalIncome'>;
  actions: Pick<BudgetActions, 'setTotalExpense' | 'setTotalIncome' | 'generateBudget'>;
}

export function BudgetForm({ data, actions }: BudgetFormProps) {
  const { totalExpense, totalIncome } = data;
  const { setTotalExpense, setTotalIncome, generateBudget } = actions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateBudget();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              <Label htmlFor="total-expense">Total Expense</Label>
            </TableCell>
            <TableCell className="text-center">
              <Input
                id="total-expense"
                type="number"
                placeholder="Enter total expense"
                value={totalExpense || ''}
                onChange={(e) => setTotalExpense(Number(e.target.value))}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              <Label htmlFor="total-income">Total Income</Label>
            </TableCell>
            <TableCell className="text-center">
              <Input
                id="total-income"
                type="number"
                placeholder="Enter total income"
                value={totalIncome || ''}
                onChange={(e) => setTotalIncome(Number(e.target.value))}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Button type="submit">Generate</Button>
      </div>
    </form>
  );
}
