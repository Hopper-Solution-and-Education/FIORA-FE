'use client';

import { useAppSelector } from '@/store';
import { useEffect, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const { totalExpense, totalIncome } = useAppSelector((state) => state.budget);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const halfYearlyAmount = totalExpense / 2;
  const quarterlyAmount = totalExpense / 4;
  const monthlyAmount = totalExpense / 12;
  const monthlyIncome = totalIncome / 12;

  return {
    isMobile,
    halfYearlyAmount,
    quarterlyAmount,
    monthlyAmount,
    monthlyIncome,
  };
}
