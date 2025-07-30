import { Icons } from '@/components/Icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COLORS } from '@/shared/constants/chart';
import { BudgetDetailFilterEnum } from '../../data/constants';

interface BudgetDetailTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

/**
 * Component for budget detail tabs (Expense/Income)
 * Displays expense and income tabs with appropriate icons and colors
 */
export default function BudgetDetailTabs({ activeTab, onTabChange }: BudgetDetailTabsProps) {
  return (
    <Tabs
      defaultValue="expense"
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full sm:w-auto"
    >
      <TabsList className="grid grid-cols-2 sm:flex w-full sm:w-auto rounded-lg">
        <TabsTrigger
          value={BudgetDetailFilterEnum.EXPENSE}
          className="flex items-center gap-2 rounded-lg transition-all"
        >
          <Icons.trendindDown size={16} color={COLORS.DEPS_DANGER.LEVEL_1} />
          Expense
        </TabsTrigger>
        <TabsTrigger
          value={BudgetDetailFilterEnum.INCOME}
          className="flex items-center gap-2 rounded-lg transition-all"
        >
          <Icons.trendingUp size={16} color={COLORS.DEPS_SUCCESS.LEVEL_1} />
          Income
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
