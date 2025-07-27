import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PERIOD_OPTIONS } from '../../data/constants';

interface BudgetDetailPeriodSelectProps {
  periodId: string;
  onPeriodChange: (value: string) => void;
}

/**
 * Component for budget detail period selection
 * Allows users to select between month, quarter, half-year, and year views
 */
export default function BudgetDetailPeriodSelect({
  periodId,
  onPeriodChange,
}: BudgetDetailPeriodSelectProps) {
  return (
    <Select onValueChange={onPeriodChange} value={periodId}>
      <SelectTrigger className="w-full sm:w-[150px] rounded-lg">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {PERIOD_OPTIONS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
