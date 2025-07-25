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
import { useMemo } from 'react';
import { PERIOD_OPTIONS } from '../../data/constants';
import { convertTableDataCurrency } from '../../utils/convertTableDataCurrency';
import BudgetSummaryYearSelect from '../atoms/BudgetSummaryYearSelect';
import { getBudgetColumns } from '../hooks/useBudgetColumns';
import { useBudgetDetail } from '../hooks/useBudgetDetail';

interface BudgetDetailProps {
  year: number;
}

const BudgetDetail = ({ year: initialYear }: BudgetDetailProps) => {
  const { currency, isFullCurrencyDisplay } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const { isMobile } = useMatchBreakpoint();

  // Sử dụng hook tổng hợp
  const {
    state,
    handlePeriodChange,
    handleTabChange,
    handleAddCategoryRow,
    handleRemoveCategoryRow,
    setSelectedCategories,
    handleCategorySelected,
    handleValidateClick,
    handleValueChange,
    rowLoading,
    // ... các handler khác nếu cần
  } = useBudgetDetail(initialYear);

  // Lấy các state cần thiết từ state
  const {
    period,
    periodId,
    activeTab,
    tableData,
    categoryList,
    categoryRows,
    selectedCategories,
    isLoading,
  } = state;

  // Convert table data theo currency display
  const convertedTableData = useMemo(() => {
    return convertTableDataCurrency(tableData, currency, isFullCurrencyDisplay);
  }, [tableData, currency, isFullCurrencyDisplay]);

  // Columns cho TableV2
  const columns = getBudgetColumns({
    period: period as any, // hoặc ép kiểu BudgetPeriodType nếu import được
    periodId,
    table: { data: convertedTableData, set: () => {}, fetch: async () => {} },
    categories: { data: categoryList, set: () => {}, fetch: async () => {} },
    currency,
    activeTab: activeTab as any, // hoặc ép kiểu BudgetDetailFilterType nếu import được
    categoryRows,
    selectedCategories,
    handleCategoryChange: () => {},
    handleValidateClick, // truyền handler thực tế
    handleValueChange, // truyền handler thực tế
    handleCategorySelected, // truyền handler thực tế
    handleDeleteCategory: () => {},
    handleRemoveCategory: () => {},
    handleClearTopDown: () => {},
    initialYear,
    isFullCurrencyDisplay,
    rowLoading, // truyền loading từng dòng
  });

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
                  onClick={handleAddCategoryRow}
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
              onValueChange={handleTabChange}
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
                onClick={handleAddCategoryRow}
              />
            </div>
          )}
        </div>
        <div className="w-[5rem] md:w-[20rem] lg:w-[50rem] min-w-full">
          <TableV2
            columns={columns}
            dataSource={convertedTableData}
            loading={isLoading}
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
