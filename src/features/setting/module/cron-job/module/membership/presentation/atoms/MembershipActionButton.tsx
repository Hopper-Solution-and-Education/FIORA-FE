import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { membershipCronjobContainer } from '../../di/membershipCronjobDashboardDI';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IGetMembershipDynamicFieldsUseCase } from '../../domain/usecase/GetMembershipDynamicFieldsUseCase';

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

  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const useCase = membershipCronjobContainer.get<IGetMembershipDynamicFieldsUseCase>(
      MEMBERSHIP_CRONJOB_TYPES.IGetMembershipDynamicFieldsUseCase,
    );
    useCase
      .execute()
      .then(setOptions)
      .catch(() => setOptions([]));
  }, []);

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
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
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
