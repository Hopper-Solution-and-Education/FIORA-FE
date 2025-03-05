'use client';

import { useEffect, useState } from 'react';
import { BudgetType } from '../types/budget';

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

export function useBudgetControl() {
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [editableValues, setEditableValues] = useState<{ [key: string]: number }>({});
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [trueExpense, setTrueExpense] = useState<number[]>(new Array(12).fill(0));
  const [trueIncome, setTrueIncome] = useState<number[]>(new Array(12).fill(0));
  const [plannedIncome, setPlannedIncome] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateBudget = () => {
    setShowTable(true);

    // Initialize editable values with default calculations
    const initialValues: { [key: string]: number } = {};
    const initialPlannedIncome: { [key: string]: number } = {};

    // Set default values for yearly and half-yearly
    initialValues['yearly'] = totalExpense;
    initialValues['halfYearly'] = totalExpense / 2;

    // Set default monthly values
    MONTHS.forEach((month) => {
      initialValues[month] = totalExpense / 12;
      initialPlannedIncome[month] = totalIncome / 12;
    });

    setEditableValues(initialValues);
    setPlannedIncome(initialPlannedIncome);
    setEditing({});
  };

  const handleEdit = (key: string | number, value: string, type: BudgetType = 'expense') => {
    const numValue = Number(value) || 0;

    if (typeof key === 'number') {
      if (type === 'expense') {
        // Update true expense
        setTrueExpense((prev) => {
          const newExpenses = [...prev];
          newExpenses[key] = numValue;
          return newExpenses;
        });
      } else {
        // Update true income
        setTrueIncome((prev) => {
          const newIncome = [...prev];
          newIncome[key] = numValue;
          return newIncome;
        });
      }
    } else {
      if (type === 'expense') {
        // Update planned expense
        setEditableValues((prev) => ({ ...prev, [key]: numValue }));
      } else {
        // Update planned income
        setPlannedIncome((prev) => ({ ...prev, [key]: numValue }));
      }
    }
  };

  const toggleEdit = (key: string | number) => {
    setEditing((prev) => ({ ...prev, [key]: true }));
  };

  const handleBlur = (key: string | number) => {
    setEditing((prev) => ({ ...prev, [key]: false }));
  };

  const halfYearlyAmount = totalExpense / 2;
  const quarterlyAmount = totalExpense / 4;
  const monthlyAmount = totalExpense / 12;
  const monthlyIncome = totalIncome / 12;

  return {
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
    quarterlyAmount,
    monthlyAmount,
    monthlyIncome,
    handleEdit,
    toggleEdit,
    handleBlur,
    generateBudget,
  };
}
