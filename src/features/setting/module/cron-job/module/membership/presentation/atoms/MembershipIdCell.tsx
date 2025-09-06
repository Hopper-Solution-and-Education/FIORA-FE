import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/shared/lib/formatDateTime';

interface MembershipIdCellProps {
  id: string;
  executionTime: string;
  className?: string;
}

const MembershipIdCell = ({ id, executionTime, className }: MembershipIdCellProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className || ''}`}>
      <Button
        variant="link"
        className="h-auto p-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-mono text-sm"
        onClick={() => {
          // TODO: Add navigation to detail page if needed
          console.log('Navigate to membership detail:', id);
        }}
      >
        {id.padStart(6, '0')}
      </Button>
      <span className="text-xs text-muted-foreground">{formatDateTime(executionTime)}</span>
    </div>
  );
};

export default MembershipIdCell;
