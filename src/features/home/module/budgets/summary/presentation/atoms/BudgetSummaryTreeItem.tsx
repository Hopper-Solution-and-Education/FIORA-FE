'use client';

import { ChevronDown, ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/shared/utils';

// Props for the BudgetTreeItem component
interface BudgetTreeItemProps {
  id: string; // Unique identifier for the item
  level: number; // Nesting level in the tree (0 = year, 1 = half-year, 2 = quarter, etc.)
  hasChildren?: boolean; // Whether this item has child items
  isExpanded?: boolean; // Whether this item is expanded to show children
  onToggle: (id: string) => void; // Function to toggle expand/collapse
  showVerticalLine?: boolean; // Whether to show vertical connection line
  showHorizontalLine?: boolean; // Whether to show horizontal connection line
  children: ReactNode; // Content to render inside the item
}

const BudgetTreeItem = ({
  id,
  level,
  hasChildren = false,
  isExpanded = false,
  onToggle,
  showVerticalLine = false,
  showHorizontalLine = false,
  children,
}: BudgetTreeItemProps) => {
  return (
    <div className="relative mb-4">
      {/* Horizontal line connecting to parent's vertical line */}
      {showHorizontalLine && (
        <div
          className="absolute w-4 h-0.5 bg-gray-300 dark:bg-gray-700"
          style={{
            left: `${level * 24 + 8}px`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      )}

      <div className="flex items-center">
        <div
          className={cn('flex items-center w-full relative', showVerticalLine ? 'ml-8' : '')}
          style={{ marginLeft: level >= 2 ? `${level * 24}px` : '0px' }}
        >
          {/* Main content container */}
          <div className="flex-1 relative">
            {children}

            {/* Expand/collapse button for items with children */}
            {hasChildren && (
              <button
                onClick={() => onToggle(id)}
                className="absolute bottom-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none bg-white rounded-full shadow-sm z-10"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTreeItem;
