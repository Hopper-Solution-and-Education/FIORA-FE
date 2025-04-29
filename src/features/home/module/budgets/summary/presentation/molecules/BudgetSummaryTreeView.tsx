'use client';

import { CustomBarItem } from '@/components/common/stacked-bar-chart/type';
import { useEffect, useState } from 'react';
import BudgetTreeItem from '../atoms/BudgetSummaryTreeItem';
import BudgetChart from '../atoms/BudgetSummaryChart';
import { STACK_TYPE } from '@/shared/constants/chart';

// Interface for hierarchical budget data structure
interface HierarchicalBarItem extends CustomBarItem {
  children?: HierarchicalBarItem[];
  data?: any[];
  level?: number;
  type: STACK_TYPE;
}

// Props for the BudgetTreeView component
interface BudgetTreeViewProps {
  data: HierarchicalBarItem[];
  currency: string;
}

const BudgetTreeView = ({ data, currency }: BudgetTreeViewProps) => {
  // State to track which items are expanded in the tree
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Recursive function to render the tree structure
  const renderTree = (items: HierarchicalBarItem[], level = 0, isHalfYear = false) => {
    return items
      .map((item) => {
        const isExpanded = expandedItems[item.id as string] || false;
        const hasChildren = item.children && item.children.length > 0;

        // Check if this is a year-level item (top level)
        const isYear = level === 0;

        // Check if this is a half-year item or within half-year context
        const isHalfYearItem = item.name?.includes('Half Year') || isHalfYear;

        // Special handling for year items with children
        if (isYear && hasChildren) {
          // Filter out half-year items from children
          const halfYearItems = item.children?.filter((child) => child.name?.includes('Half Year'));

          // Function to render half-year items and their children
          const renderHalfYearContent = () => {
            return halfYearItems?.map((halfYear) => {
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
                    showHorizontalLine={true}
                  >
                    <BudgetChart
                      data={halfYear.data || []}
                      title={halfYear.name}
                      currency={currency}
                    />
                  </BudgetTreeItem>

                  {/* Render children of half-year item when expanded */}
                  {halfYearExpanded && halfYearHasChildren && (
                    <div className="relative mt-2">
                      {/* Vertical line connecting half-year to its quarters */}
                      <div
                        className="absolute left-0 top-0 w-0.5 bg-gray-300 dark:bg-gray-700 h-full"
                        style={{ left: `24px` }}
                      />
                      <div className="ml-4">
                        {/* Render quarter items with level 2 */}
                        {renderTree(halfYear.children as HierarchicalBarItem[], 2, true)}
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
              {/* Render the year item */}
              <BudgetTreeItem
                id={item.id as string}
                level={0}
                hasChildren={false}
                isExpanded={false}
                onToggle={toggleExpand}
                showVerticalLine={false}
              >
                <BudgetChart data={item.data || []} title={item.name} currency={currency} />
              </BudgetTreeItem>

              {/* Separator between year and half-years */}
              <div className="my-4 border-t-2 border-gray-200 dark:border-gray-700"></div>

              {/* Container for half-year items */}
              <div className="relative">{renderHalfYearContent()}</div>
            </div>
          );
        }

        // Render items at level 2+ (quarters, months) or half-year items
        if (level >= 2 || isHalfYearItem) {
          return (
            <div key={item.id} className="relative">
              {/* Render the item (quarter, month, etc.) */}
              <BudgetTreeItem
                id={item.id as string}
                level={level}
                hasChildren={hasChildren}
                isExpanded={isExpanded}
                onToggle={toggleExpand}
                showVerticalLine={level >= 2}
                showHorizontalLine={true}
              >
                <BudgetChart data={item.data || []} title={item.name} currency={currency} />
              </BudgetTreeItem>

              {/* Render children when expanded */}
              {isExpanded && hasChildren && (
                <div className="relative">
                  {/* Vertical line connecting parent to children for level 2+ */}
                  {level >= 2 && (
                    <div
                      className="absolute left-0 top-0 w-0.5 bg-gray-300 dark:bg-gray-700 h-full"
                      style={{ left: `${level * 24 + 12}px` }}
                    />
                  )}
                  <div className="ml-4">
                    {/* Recursively render children with increased level */}
                    {renderTree(item.children as HierarchicalBarItem[], level + 1)}
                  </div>
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
