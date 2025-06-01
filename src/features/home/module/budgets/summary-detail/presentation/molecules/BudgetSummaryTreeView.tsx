'use client';

import { useEffect, useRef, useState } from 'react';
import BudgetTreeItem from '../atoms/BudgetSummaryTreeItem';
import BudgetChart from '../atoms/BudgetSummaryChart';
import { HierarchicalBarItem } from '../types/chart.type';
import { BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL } from '../../data/constants';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BudgetDetailType } from '../types/table.type';
import { routeConfig } from '@/shared/utils/route';
import { RouteEnum } from '@/shared/constants/RouteEnum';

interface BudgetTreeViewProps {
  data: HierarchicalBarItem[];
  currency: string;
  year: string;
}

const BudgetTreeView = ({ data, currency, year }: BudgetTreeViewProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const yearRef = useRef<HTMLDivElement | null>(null);

  // Initialize expanded state for all items when data changes
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    const initializeExpanded = (items: HierarchicalBarItem[]) => {
      items.forEach((item) => {
        initialState[item.id as string] = false;
        if (item.children) {
          initializeExpanded(item.children);
        }
      });
    };

    if (data && data.length > 0) {
      initializeExpanded(data);
      setExpandedItems(initialState);
    }
  }, [data]);

  // Toggle expand/collapse state for a specific item
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      const isCurrentlyExpanded = prev[id];

      newState[id] = !isCurrentlyExpanded;

      if (isCurrentlyExpanded) {
        const closeChildItems = (parentId: string, items: HierarchicalBarItem[]) => {
          items.forEach((item) => {
            if (item.id === parentId) {
              if (item.children) {
                item.children.forEach((child: HierarchicalBarItem) => {
                  newState[child.id as string] = false;
                  if (child.children && child.children.length > 0) {
                    closeChildItems(child.id as string, [child]);
                  }
                });
              }
            } else if (item.children) {
              closeChildItems(parentId, item.children);
            }
          });
        };

        closeChildItems(id, data);
      }

      return newState;
    });
  };

  const handleChartClick = (item: HierarchicalBarItem) => {
    let period: string;
    let periodId: string;

    // Determine period and periodId based on item name and level
    if (item.name.includes('Half Year')) {
      period = BudgetDetailType.HALF_YEAR;
      periodId = `half-year-${item.name.split(' ')[2]}`;
    } else if (item.name.includes('Quarter')) {
      period = BudgetDetailType.QUARTER;
      periodId = `quarter-${item.name.split(' ')[1]}`;
    } else if (
      item.name.includes('Month') ||
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].some(
        (month) => item.name.includes(month),
      )
    ) {
      period = BudgetDetailType.MONTH;
      const monthMap: { [key: string]: number } = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
      };
      const monthNumber = monthMap[item.name.slice(0, 3)];
      periodId = `month-${monthNumber}`;
    } else {
      period = BudgetDetailType.YEAR;
      periodId = 'year';
    }

    router.push(routeConfig(RouteEnum.BudgetDetail, { year }, { period, periodId }));
  };

  const renderChart = (item: HierarchicalBarItem) => (
    <div onClick={() => handleChartClick(item)} className="cursor-pointer w-full">
      <BudgetChart data={item.data || []} title={item.name} currency={currency} />
    </div>
  );

  const renderTree = (items: HierarchicalBarItem[], level = 0, isHalfYear = false) => {
    return items
      .map((item) => {
        const isExpanded = expandedItems[item.id as string] || false;
        const hasChildren = item.children && item.children.length > 0;

        const isYear = level === 0;

        // Check if this is a half-year item or within half-year context
        const isHalfYearItem = item.name?.includes('Half Year') || isHalfYear;

        if (isYear && hasChildren) {
          const halfYearItems = item.children?.filter((child: HierarchicalBarItem) =>
            child.name?.includes('Half Year'),
          );

          const renderHalfYearContent = () => {
            return halfYearItems?.map((halfYear: HierarchicalBarItem) => {
              const halfYearExpanded = expandedItems[halfYear.id as string] || false;
              const halfYearHasChildren = halfYear.children && halfYear.children.length > 0;

              return (
                <div key={halfYear.id} className="mt-4">
                  {/* Render the half-year item */}
                  <BudgetTreeItem
                    id={halfYear.id as string}
                    level={0}
                    hasChildren={halfYearHasChildren}
                    isExpanded={halfYearExpanded}
                    onToggle={toggleExpand}
                    showVerticalLine={true}
                  >
                    {renderChart(halfYear)}
                  </BudgetTreeItem>

                  {/* Render children of half-year item when expanded */}
                  {halfYearExpanded && halfYearHasChildren && (
                    <div className="relative mt-2">
                      {/* Vertical line connecting half-year to its quarters */}
                      <motion.div
                        className="absolute top-0 w-0.5 bg-gray-300 dark:bg-gray-700"
                        style={{
                          left: `${level * BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL}px`,
                          originY: 0,
                        }}
                        initial={{ scaleY: 0 }}
                        animate={{
                          scaleY: 1,
                          height: `calc(100% - ${yearRef.current?.offsetHeight && yearRef.current?.offsetHeight / 2}px)`,
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />

                      <div className="">
                        {/* Render quarter items with level 1 */}
                        {renderTree(halfYear.children as HierarchicalBarItem[], 1, true)}
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          };

          // Render year item and its half-year children
          return (
            <div key={item.id} className="relative">
              <BudgetTreeItem
                id={item.id as string}
                level={0}
                hasChildren={false}
                isExpanded={false}
                onToggle={toggleExpand}
                showVerticalLine={false}
                ref={yearRef}
              >
                {renderChart(item)}
              </BudgetTreeItem>

              <div className="my-4 border-t-2 border-gray-200 dark:border-gray-700"></div>

              <div className="relative">{renderHalfYearContent()}</div>
            </div>
          );
        }

        // Render items at level 1+ (quarters, months) or half-year items
        if (level >= 0 || isHalfYearItem) {
          return (
            <div key={item.id} className="relative">
              {/* Render the item (quarter, month, etc.) */}
              <BudgetTreeItem
                id={item.id as string}
                level={level}
                hasChildren={hasChildren}
                isExpanded={isExpanded}
                onToggle={toggleExpand}
                showVerticalLine={level >= 1}
                showHorizontalLine={true}
              >
                {renderChart(item)}
              </BudgetTreeItem>

              {/* Render children when expanded */}
              {isExpanded && hasChildren && (
                <div className="relative">
                  {/* Vertical line connecting parent to children for level 1+ */}
                  {level >= 1 && (
                    <motion.div
                      className="absolute top-0 w-0.5 bg-gray-300 dark:bg-gray-700"
                      style={{
                        left: `${level * BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL}px`,
                        originY: 0,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{
                        scaleY: 1,
                        height: `calc(100% - ${yearRef.current?.offsetHeight && yearRef.current?.offsetHeight / 2}px)`,
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  )}

                  {renderTree(item.children as HierarchicalBarItem[], level + 1)}
                </div>
              )}
            </div>
          );
        }

        return null;
      })
      .filter(Boolean);
  };

  return <div className="budget-tree">{renderTree(data)}</div>;
};

export default BudgetTreeView;
