import { LoadingIndicator } from '@/components/common/atoms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { routeConfig } from '@/shared/utils/route';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';

interface BudgetSummaryYearSelectProps {
  selectedYear: number;
  route: string;
}

const BudgetSummaryYearSelect = ({ selectedYear, route }: BudgetSummaryYearSelectProps) => {
  const dispatch = useAppDispatch();
  const { budgetYears, loading } = useAppSelector((state) => state.budgetSummary);
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
          {loading ? (
            <SelectItem
              disabled
              className="flex items-center justify-center p-2"
              value={`${selectedYear}`}
            >
              <LoadingIndicator size="sm" />
            </SelectItem>
          ) : (
            budgetYears?.map((year) => (
              <SelectItem key={year} value={year} className="p-2">
                {year}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BudgetSummaryYearSelect;
