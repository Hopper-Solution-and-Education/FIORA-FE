// src/presentation/hooks/useBudgetNavigation.ts
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import {
  BudgetDetailFilterType,
  BudgetDetailType,
  BudgetPeriodIdType,
  BudgetPeriodType,
} from '../types/table.type';
import { BudgetDetailFilterEnum, PERIOD_OPTIONS } from '../../data/constants';

interface UseBudgetNavigationProps {
  initialYear: number;
}

export function useBudgetNavigation({ initialYear }: UseBudgetNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<BudgetDetailFilterType>(
    BudgetDetailFilterEnum.EXPENSE,
  );

  const period = (searchParams?.get('period') || BudgetDetailType.YEAR) as BudgetPeriodType;
  const periodId = (searchParams?.get('periodId') || 'year') as BudgetPeriodIdType;

  const handlePeriodChange = (value: string) => {
    const option = PERIOD_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      router.push(
        routeConfig(
          RouteEnum.BudgetDetail,
          { year: initialYear },
          { period: option.period, periodId: value },
        ),
      );
    }
  };

  const handleFilterChange = (value: string) => setActiveTab(value as BudgetDetailFilterType);

  return { period, periodId, activeTab, handlePeriodChange, handleFilterChange };
}
