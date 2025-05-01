'use client';

import { cn } from '@/shared/utils';
import { ChevronLeft } from 'lucide-react';
import { ReactNode, forwardRef } from 'react';
import {
  BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL,
  BUDGET_SUMMARY_TREE_LINE_STOKE,
} from '../../data/constants';
import { motion } from 'framer-motion';

interface BudgetTreeItemProps {
  id: string;
  level: number;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggle: (id: string) => void;
  showVerticalLine?: boolean;
  showHorizontalLine?: boolean;
  children: ReactNode;
}

const BudgetTreeItem = forwardRef<HTMLDivElement, BudgetTreeItemProps>(
  (
    {
      id,
      level,
      hasChildren = false,
      isExpanded = false,
      onToggle,
      showHorizontalLine = false,
      children,
    },
    ref,
  ) => {
    return (
      <div className="relative mb-4" ref={ref}>
        <div className="flex items-center">
          <div
            className={cn('flex items-center w-full relative')}
            style={{
              marginLeft:
                level >= 1
                  ? `${(level - 1) * BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL}px`
                  : '0px',
            }}
          >
            {/* Main content container */}
            {showHorizontalLine && (
              <div
                className={`h-[${BUDGET_SUMMARY_TREE_LINE_STOKE}] bg-gray-300 dark:bg-gray-700 w-6`}
              />
            )}
            {children}

            {hasChildren && (
              <motion.button
                onClick={() => onToggle(id)}
                className="absolute bottom-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none bg-white rounded-full shadow-sm z-10"
                animate={{ rotate: isExpanded ? -90 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ChevronLeft size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

BudgetTreeItem.displayName = 'BudgetTreeItem';

export default BudgetTreeItem;
