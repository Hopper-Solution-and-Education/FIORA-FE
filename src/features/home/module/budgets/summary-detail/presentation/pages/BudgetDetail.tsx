'use client';

import { TableV2 } from '@/components/common/tables/custom-table';
import ActionButton from '@/components/common/UIKit/Button/ActionButton';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import useMatchBreakpoint from '@/shared/hooks/useMatchBreakpoint';
import { cn } from '@/shared/utils';
import { routeConfig } from '@/shared/utils/route';
import BudgetDetailExpandToggle from '../atoms/BudgetDetailExpandToggle';
import BudgetDetailPeriodSelect from '../atoms/BudgetDetailPeriodSelect';
import BudgetDetailTabs from '../atoms/BudgetDetailTabs';
import BudgetSummaryYearSelect from '../atoms/BudgetSummaryYearSelect';
import CurrencyDisplayToggle from '../atoms/CurrencyDisplayToggle';
import { useBudgetColumns } from '../hooks/useBudgetColumns';
import { useBudgetDetail } from '../hooks/useBudgetDetail';
import { useBudgetDetailStateContext } from '../hooks/useBudgetDetailStateContext';

interface BudgetDetailProps {
  year: number;
}

const BudgetDetail = ({ year: initialYear }: BudgetDetailProps) => {
  const { isMobile } = useMatchBreakpoint();
  const {
    state: { period, periodId, activeTab, isLoading, expand },
  } = useBudgetDetailStateContext();

  const {
    handlePeriodChange,
    handleTabChange,
    handleAddCategoryRow,
    handleCategorySelected,
    handleValidateClick,
    handleValueChange,
    handleRemoveRow,
    dispatch,
  } = useBudgetDetail(initialYear);

  const { columns, convertedTableData } = useBudgetColumns({
    handleValidateClick,
    handleValueChange,
    handleCategorySelected,
    handleRemoveRow,
  });

  const handleToggleExpand = () => {
    dispatch({ type: 'SET_EXPAND', payload: !expand });
  };

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
              {isMobile && <CurrencyDisplayToggle className="ml-2 min-w-[120px]" />}
              {isMobile && (
                <ActionButton
                  tooltipContent="Add New Category"
                  showIcon={true}
                  onClick={handleAddCategoryRow}
                />
              )}
            </div>

            <BudgetDetailPeriodSelect periodId={periodId} onPeriodChange={handlePeriodChange} />
            <BudgetDetailTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Tabs toggle currency display (desktop) */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <CurrencyDisplayToggle className="min-w-[120px]" />
              <BudgetDetailExpandToggle isExpanded={expand} onToggle={handleToggleExpand} />
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
            tableContainerClassName={cn('overflow-y-auto', expand ? '' : 'max-h-[30rem]')}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetail;
