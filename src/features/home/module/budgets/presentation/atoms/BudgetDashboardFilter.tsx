import { DateTimePicker } from '@/components/common/forms';
import { Label } from '@/components/ui/label';

const BudgetDashboardFilter = () => {
  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        <Label>Date</Label>
        <DateTimePicker value={undefined} onChange={(value) => console.log(value)} />
      </div>
    </div>
  );
};

export default BudgetDashboardFilter;
