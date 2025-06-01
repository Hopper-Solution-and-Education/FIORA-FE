import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { routeConfig } from '@/shared/utils/route';
import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';

interface BudgetSummaryYearSelectProps {
  selectedYear: number;
  route: string;
}

const BudgetSummaryYearSelect = ({ selectedYear, route }: BudgetSummaryYearSelectProps) => {
  const { budgets } = useAppSelector((state) => state.budgetControl.getBudget);
  const router = useRouter();

  const handleSelectedYearChange = (year: string) => {
    router.push(routeConfig(route, { year: year }));
  };

  return (
    <div className="h-full min-w-24">
      <Select defaultValue={`${selectedYear}`} onValueChange={handleSelectedYearChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {budgets.map((budget) => (
            <SelectItem key={budget.year} value={budget.year.toString()} className="p-2">
              {budget.year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BudgetSummaryYearSelect;
