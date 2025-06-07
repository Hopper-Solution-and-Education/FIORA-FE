// src/presentation/BudgetDetail.tsx
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
import { useLayoutEffect, useMemo, useState } from 'react';
import { PERIOD_OPTIONS } from '../../data/constants';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import BudgetSummaryYearSelect from '../atoms/BudgetSummaryYearSelect';
import { useBudgetCategories } from '../hooks/useBudgetCategories';
import { useBudgetColumns } from '../hooks/useBudgetColumns';
import { useBudgetNavigation } from '../hooks/useBudgetNavigation';
import { useBudgetTableData } from '../hooks/useBudgetTableData';
import { useCategoryManagement } from '../hooks/useCategoryManagement';
import { TableData } from '../types/table.type';

interface BudgetDetailProps {
  year: number;
}

const BudgetDetail = ({ year: initialYear }: BudgetDetailProps) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const { currency } = useAppSelector((state) => state.settings);

  const budgetSummaryUseCase = useMemo(
    () => budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(TYPES.IBudgetSummaryUseCase),
    [],
  );

  const { period, periodId, activeTab, handlePeriodChange, handleFilterChange } =
    useBudgetNavigation({ initialYear });

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
    setTableData,
    initialYear,
    activeTab,
    tableData,
  });

  const { isLoading, handleValueChange, handleValidateClick } = useBudgetTableData({
    initialYear,
    activeTab,
    period,
    periodId,
    currency: currency,
    budgetSummaryUseCase,
    tableData,
    setTableData,
    setSelectedCategories,
  });

  const { categoryList, handleCategoryChange } = useBudgetCategories({
    activeTab,
    budgetSummaryUseCase,
    setTableData,
    initialYear,
    period, // Add these props
    periodId, // Add these props
  });

  const { columns } = useBudgetColumns({
    period,
    periodId,
    currency: currency,
    categoryList,
    activeTab,
    categoryRows,
    selectedCategories,
    handleCategoryChange,
    handleValidateClick,
    handleValueChange,
    handleCategorySelected,
    handleDeleteCategory,
    handleRemoveCategory,
    setTableData,
    tableData,
    initialYear,
  });

  useLayoutEffect(() => {
    setTimeout(() => {
      if (tableData.length === 3) {
        handleAddCategory(setTableData);
      }
    }, 500);
  }, [tableData.length]);

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
            onClick={() => handleAddCategory(setTableData)}
          />
        </div>
      </div>

      <div className="w-[50rem] md:w-[20rem] sm:w-[10rem] xs min-w-full">
        <div className="w-full">
          <TableV2
            columns={columns}
            dataSource={tableData}
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
