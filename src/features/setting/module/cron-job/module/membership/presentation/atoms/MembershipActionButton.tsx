import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MembershipActionButtonProps {
  status: string;
  toTier?: string;
  onRetry?: (id: string) => void;
  className?: string;
}

const MembershipActionButton = ({
  status,
  toTier,
  onRetry,
  className,
}: MembershipActionButtonProps) => {
  // Only show action button for failed status
  if (status.toLowerCase() !== 'fail') {
    return null;
  }

  const handleRetry = () => {
    if (onRetry) {
      // TODO: Get the actual membership ID from context or props
      onRetry('membership-id');
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Select defaultValue={toTier || ''}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Select tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="titan-phoenix">Titan Phoenix</SelectItem>
          <SelectItem value="gold-tortoise">Gold Tortoise</SelectItem>
          <SelectItem value="silver-egg">Silver Egg</SelectItem>
          <SelectItem value="platinum-qili">Platinum Qili</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRetry}
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Icons.check className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MembershipActionButton;
