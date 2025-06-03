import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { routeConfig } from '@/shared/utils/route';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { BudgetSummaryMapper } from '../../data/mappers/BudgetSummaryMapper';
import { toast } from 'sonner';
import { LoadingIndicator } from '@/components/common/atoms/LoadingIndicator';

interface BudgetSummaryYearSelectProps {
  selectedYear: number;
  route: string;
}

const BudgetSummaryYearSelect = ({ selectedYear, route }: BudgetSummaryYearSelectProps) => {
  const [budgetYears, setBudgetYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
    TYPES.IBudgetSummaryUseCase,
  );

  useEffect(() => {
    const fetchBudgetYears = async () => {
      setIsLoading(true);
      try {
        const response = await budgetSummaryUseCase.getBudgetYears();
        const years = BudgetSummaryMapper.toBudgetYears(response);
        setBudgetYears(years);
      } catch (error: any) {
        toast.error(error?.message || 'Failed to fetch budget years');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetYears();
  }, [budgetSummaryUseCase]);

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
          {isLoading ? (
            <SelectItem
              disabled
              className="flex items-center justify-center p-2"
              value={`${selectedYear}`}
            >
              <LoadingIndicator size="sm" />
            </SelectItem>
          ) : (
            budgetYears.map((year) => (
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
