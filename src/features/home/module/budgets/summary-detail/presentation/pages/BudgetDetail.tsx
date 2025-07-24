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
import useMatchBreakpoint from '@/shared/hooks/useMatchBreakpoint';
import { cn } from '@/shared/utils';
import { routeConfig } from '@/shared/utils/route';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFullCurrencyDisplay } from '@/store/slices/setting.slice';
import { useLayoutEffect, useMemo } from 'react';
import { PERIOD_OPTIONS } from '../../data/constants';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { convertTableDataCurrency } from '../../utils/convertTableDataCurrency';
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
  const { currency, isFullCurrencyDisplay } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const { isMobile } = useMatchBreakpoint();

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
    isLoading: isCategoryLoading,
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

  const { handleValueChange, handleValidateClick, handleClearTopDown } = useBudgetTableData({
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

  const convertedTableData = useMemo(() => {
    return convertTableDataCurrency(table.data, currency);
  }, [table.data, currency]);

  const { columns } = useBudgetColumns({
    period,
    periodId,
    table: { ...table, data: convertedTableData },
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
    handleClearTopDown,
    initialYear,
  });

  useLayoutEffect(() => {
    if (table.data.length === 3) {
      handleAddCategory();
    }
  }, [table.data.length, handleAddCategory]);

  return (
    <div className="p-4 w-full flex flex-col min-h-screen">
      <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 justify-between">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center flex-wrap">
            <div className={cn(isMobile && 'flex w-full justify-between')}>
              <BudgetSummaryYearSelect
                selectedYear={initialYear}
                route={routeConfig(RouteEnum.BudgetDetail, {}, { period, periodId })}
              />

              {/* Tabs toggle currency display (mobile) */}
              {isMobile && (
                <Tabs
                  value={isFullCurrencyDisplay ? 'full' : 'short'}
                  onValueChange={(val) => dispatch(setFullCurrencyDisplay(val === 'full'))}
                  className="ml-2 min-w-[120px]"
                >
                  <TabsList className="w-full grid grid-cols-2 rounded-lg bg-muted/30">
                    <TabsTrigger value="full" className="flex items-center gap-1 px-2 py-1 text-xs">
                      <Icons.eye size={16} className="text-primary" />
                      1K | 1M | 1B
                    </TabsTrigger>
                    <TabsTrigger
                      value="short"
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      <Icons.eyeOff size={16} className="text-muted-foreground" />K | M | B
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              {isMobile && (
                <ActionButton
                  tooltipContent="Add New Category"
                  showIcon={true}
                  onClick={handleAddCategory}
                />
              )}
            </div>
            <Select onValueChange={handlePeriodChange} value={periodId}>
              <SelectTrigger className="w-full sm:w-[150px] rounded-lg">
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

            <Tabs
              defaultValue="expense"
              value={activeTab}
              onValueChange={handleFilterChange}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 sm:flex w-full sm:w-auto  rounded-lg">
                <TabsTrigger
                  value="expense"
                  className="flex items-center gap-2 rounded-lg transition-all"
                >
                  <Icons.trendindDown size={16} color={COLORS.DEPS_DANGER.LEVEL_1} />
                  Expense
                </TabsTrigger>

                <TabsTrigger
                  value="income"
                  className="flex items-center gap-2 rounded-lg transition-all"
                >
                  <Icons.trendingUp size={16} color={COLORS.DEPS_SUCCESS.LEVEL_1} />
                  Income
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tabs toggle currency display (desktop) */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Tabs
                value={isFullCurrencyDisplay ? 'full' : 'short'}
                onValueChange={(val) => dispatch(setFullCurrencyDisplay(val === 'full'))}
                className="min-w-[120px]"
              >
                <TabsList className="w-full grid grid-cols-2 rounded-lg bg-muted/30">
                  <TabsTrigger value="full" className="flex items-center gap-1 px-2 py-1 text-xs">
                    <Icons.eye size={16} className="text-primary" />
                    1K | 1M | 1B
                  </TabsTrigger>
                  <TabsTrigger value="short" className="flex items-center gap-1 px-2 py-1 text-xs">
                    <Icons.eyeOff size={16} className="text-muted-foreground" />K | M | B
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <ActionButton
                tooltipContent="Add New Category"
                showIcon={true}
                onClick={handleAddCategory}
              />
            </div>
          )}
        </div>

        <div className="w-[5rem] md:w-[20rem] lg:w-[50rem] min-w-full">
          <TableV2
            columns={columns}
            dataSource={convertedTableData}
            loading={isLoading || isCategoryLoading}
            loadingRowCount={8}
            rowKey="key"
            bordered
            layoutBorder
            showHeader
            pagination={false}
            rowHover
            className="w-full scrollbar-thin rounded-lg shadow-sm"
            tableContainerClassName="overflow-y-auto max-h-[30rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetail;
