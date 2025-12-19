'use client';

import { TableV2 } from '@/components/common/tables/custom-table';
import ActionButton from '@/components/common/UIKit/Button/ActionButton';
import { RouteEnum } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import useMatchBreakpoint from '@/shared/hooks/useMatchBreakpoint';
import { cn } from '@/shared/utils';
import { routeConfig } from '@/shared/utils/route';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

/**
 * Table height:
 * - expand=true  → auto
 * - expand=false → auto if content fits, else fixed to remaining viewport
 */
const BudgetDetail = ({ year: initialYear }: BudgetDetailProps) => {
  const headerRef = useRef<HTMLDivElement>(null); // watch header size changes
  const tableWrapperRef = useRef<HTMLDivElement>(null); // anchor to measure remaining viewport
  const { isMobile } = useMatchBreakpoint();
  const { formatCurrency, getExchangeAmount } = useCurrencyFormatter();
  const [compactHeight, setCompactHeight] = useState<number | string>('');

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
    handleToggleExpand,
  } = useBudgetDetail(initialYear);

  const { columns, convertedTableData } = useBudgetColumns({
    handleValidateClick,
    handleValueChange,
    handleCategorySelected,
    handleRemoveRow,
    formatCurrency,
    getExchangeAmount,
  });

  // Watch table content size; trigger recalculation when content changes
  const observeTableContainer = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!tableWrapperRef.current || !('ResizeObserver' in window)) return null;

    const container = tableWrapperRef.current.querySelector(
      '.budget-table-container',
    ) as HTMLElement | null;

    if (!container) return null;

    const ro = new ResizeObserver(() => {
      recalcHeight();
    });
    ro.observe(container);
    return ro;
  }, []);

  // Recompute available height and decide auto vs fixed
  const recalcHeight = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!tableWrapperRef.current) return;

    const wrapper = tableWrapperRef.current;
    const rect = wrapper.getBoundingClientRect();
    const bottomGutter = 30;
    const available = Math.max(200, Math.floor(window.innerHeight - rect.top - bottomGutter));

    if (expand) {
      setCompactHeight('');
      return;
    }

    // compact: auto if fits, fixed if overflow
    const container = wrapper.querySelector('.budget-table-container') as HTMLElement | null;
    if (container) {
      const contentHeight = container.scrollHeight;
      setCompactHeight(contentHeight <= available ? '' : available);
    } else {
      setCompactHeight(available); // fallback before container mounts
    }
  }, [expand]);

  useLayoutEffect(() => {
    recalcHeight();
  }, [recalcHeight, expand]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResizeOrScroll = () => recalcHeight();
    window.addEventListener('resize', onResizeOrScroll);
    window.addEventListener('orientationchange', onResizeOrScroll);
    window.addEventListener('scroll', onResizeOrScroll, { passive: true });

    // watch header (tabs/filters may wrap)
    let headerRO: ResizeObserver | null = null;
    if (headerRef.current && 'ResizeObserver' in window) {
      headerRO = new ResizeObserver(onResizeOrScroll);
      headerRO.observe(headerRef.current);
    }

    // watch table content
    const tableRO = observeTableContainer();

    return () => {
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('orientationchange', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll);
      headerRO?.disconnect();
      tableRO?.disconnect();
    };
  }, [observeTableContainer, recalcHeight]);

  useEffect(() => {
    recalcHeight();
  }, [recalcHeight, isLoading, columns.length, convertedTableData.length]);

  return (
    <div className="p-4 w-full flex flex-col min-h-screen">
      <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center flex-wrap">
            <div className={cn(isMobile && 'flex w-full justify-between')}>
              <BudgetSummaryYearSelect
                selectedYear={initialYear}
                route={routeConfig(RouteEnum.BudgetDetail, {}, { period, periodId })}
              />

              {isMobile && <CurrencyDisplayToggle className="ml-2 min-w-[120px]" />}
              {isMobile && (
                <ActionButton
                  tooltipContent="Add New Category"
                  showIcon
                  onClick={handleAddCategoryRow}
                />
              )}
            </div>

            <BudgetDetailPeriodSelect periodId={periodId} onPeriodChange={handlePeriodChange} />
            <BudgetDetailTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {!isMobile && (
            <div className="flex items-center gap-2">
              <CurrencyDisplayToggle className="min-w-[120px]" />
              <BudgetDetailExpandToggle onToggle={handleToggleExpand} />
              <ActionButton
                tooltipContent="Add New Category"
                showIcon
                onClick={handleAddCategoryRow}
              />
            </div>
          )}
        </div>

        <div ref={tableWrapperRef} className="w-[5rem] md:w-[20rem] lg:w-[50rem] min-w-full">
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
            tableHeight={expand ? '' : (compactHeight as string)}
            tableContainerClassName={cn('overflow-y-auto budget-table-container')}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetail;
