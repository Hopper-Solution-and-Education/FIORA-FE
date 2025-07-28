import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

interface BudgetDetailExpandToggleProps {
  onToggle: () => void;
  className?: string;
}

/**
 * Component for budget detail table expand/collapse toggle
 * Displays expand or collapse button with appropriate icon
 */
export default function BudgetDetailExpandToggle({
  onToggle,
  className,
}: BudgetDetailExpandToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <Icons.expand size={16} />
    </Button>
  );
}
