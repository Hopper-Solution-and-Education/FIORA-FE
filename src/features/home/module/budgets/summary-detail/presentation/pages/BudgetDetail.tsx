/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { TableV2 } from '@/components/common/tables/custom-table';
import ActionButton from '@/components/common/UIKit/Button/ActionButton';
import { Icons } from '@/components/Icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COLORS } from '@/shared/constants/chart';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { useAppSelector } from '@/store';
import { useLayoutEffect, useMemo } from 'react';
import { PERIOD_OPTIONS } from '../../data/constants';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import BudgetSummaryYearSelect from '../atoms/BudgetSummaryYearSelect';
import { useBudgetCategories } from '../hooks/useBudgetCategories';
import { useBudgetColumns } from '../hooks/useBudgetColumns';
import { useBudgetInit } from '../hooks/useBudgetInit';
import { useBudgetNavigation } from '../hooks/useBudgetNavigation';
import { useBudgetTableData } from '../hooks/useBudgetTableData';
import { useCategoryManagement } from '../hooks/useCategoryManagement';

interface BudgetDetailProps {
  year: number;
}

const BudgetDetail = ({ year: initialYear }: BudgetDetailProps) => {
  const { currency } = useAppSelector((state) => state.settings);

  const budgetSummaryUseCase = useMemo(
    () => budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(TYPES.IBudgetSummaryUseCase),
    [],
  );

  const { period, periodId, activeTab, handlePeriodChange, handleFilterChange } =
    useBudgetNavigation({ initialYear });

  const { categories, table, isLoading } = useBudgetInit({
    initialYear,
    activeTab,
    budgetSummaryUseCase,
  });

  const {
    categoryRows,
    selectedCategories,
    setSelectedCategories,
    handleAddCategory,
    handleCategorySelected,
    handleRemoveCategory,
    handleDeleteCategory,
  } = useCategoryManagement({
    budgetSummaryUseCase,
    initialYear,
    activeTab,
    table,
    categories,
  });

  const { handleValueChange, handleValidateClick } = useBudgetTableData({
    initialYear,
    activeTab,
    period,
    periodId,
    currency,
    setSelectedCategories,
    table,
    categories,
    budgetSummaryUseCase,
  });

  const { handleCategoryChange } = useBudgetCategories({
    activeTab,
    budgetSummaryUseCase,
    initialYear,
    period,
    periodId,
    table,
    categories,
  });

  const { columns } = useBudgetColumns({
    period,
    periodId,
    table,
    categories,
    currency,
    activeTab,
    categoryRows,
    selectedCategories,
    handleCategoryChange,
    handleValidateClick,
    handleValueChange,
    handleCategorySelected,
    handleDeleteCategory,
    handleRemoveCategory,
    initialYear,
  });

  useLayoutEffect(() => {
    if (table.data.length === 3) {
      handleAddCategory();
    }
  }, [table.data.length]);

  return (
    <div className="p-4 w-full flex flex-col">
      <div className="flex gap-4 mb-6 justify-between">
        <div className="flex gap-4">
          <BudgetSummaryYearSelect
            selectedYear={initialYear}
            route={routeConfig(RouteEnum.BudgetDetail, {}, { period, periodId })}
          />

          <Select onValueChange={handlePeriodChange} value={periodId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs defaultValue="expense" value={activeTab} onValueChange={handleFilterChange}>
            <TabsList>
              <TabsTrigger value="expense" className="flex items-center gap-2">
                <Icons.trendindDown size={16} color={COLORS.DEPS_DANGER.LEVEL_1} />
                Expense
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2">
                <Icons.trendingUp size={16} color={COLORS.DEPS_SUCCESS.LEVEL_1} />
                Income
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          <ActionButton
            tooltipContent="Add New Category"
            showIcon={true}
            onClick={() => handleAddCategory()}
          />
        </div>
      </div>

      <div className="w-[50rem] md:w-[20rem] sm:w-[10rem] xs min-w-full">
        <div className="w-full">
          <TableV2
            columns={columns}
            dataSource={table.data}
            loading={isLoading}
            rowKey="key"
            bordered
            layoutBorder
            showHeader
            rowHover
            pagination={false}
            scroll={{ x: 2000 }}
            className="w-full scrollbar-thin"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetail;
