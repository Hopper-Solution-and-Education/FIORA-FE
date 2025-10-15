'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

type ChildProps = {
  click: () => void;
};

const SavingDepositButton = ({ click }: ChildProps) => {
  return (
    <CommonTooltip content="Deposit">
      <Button
        variant="outline"
        size="icon"
        aria-label="Deposit"
        onClick={click}
        className="w-11 h-11 [&_svg]:size-6 hover:bg-green-100 dark:hover:bg-green-900 hover:border-green-100 dark:hover:border-green-900"
      >
        <Icons.banknoteArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      </Button>
    </CommonTooltip>
  );
};

export default SavingDepositButton;
