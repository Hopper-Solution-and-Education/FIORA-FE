import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { FC } from 'react';
import { FlexiInterestCronjobTableStatusType } from '../types/flexi-interest.type';

interface FlexiInterestActionButtonProps {
  status: FlexiInterestCronjobTableStatusType;
}

const FlexiInterestActionButton: FC<FlexiInterestActionButtonProps> = ({ status }) => {
  const isVisible = status === 'fail';

  return (
    isVisible && (
      <Button variant={'link'} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        <Icons.edit className="w-4 h-4" />
      </Button>
    )
  );
};

export default FlexiInterestActionButton;
