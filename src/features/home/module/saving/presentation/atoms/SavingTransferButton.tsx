'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

type ChildProps = {
  click: () => void;
};

const SavingTransferButton = ({ click }: ChildProps) => {
  return (
    <CommonTooltip content="Transfer">
      <Button
        variant="outline"
        size="icon"
        aria-label="Transfer"
        onClick={click}
        className="w-11 h-11 [&_svg]:size-6 hover:bg-orange-100 dark:hover:bg-orange-900 hover:border-orange-100 dark:hover:border-orange-900"
      >
        <Icons.arrowLeftRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      </Button>
    </CommonTooltip>
  );
};

export default SavingTransferButton;
