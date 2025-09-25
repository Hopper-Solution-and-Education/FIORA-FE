'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

type ChildProps = {
  click: () => void;
};

const SavingDepositButton = ({ click }: ChildProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Deposit"
      onClick={click}
      className="w-10 h-10 [&_svg]:size-6 hover:bg-green-100 dark:hover:bg-green-900 hover:border-green-100 dark:hover:border-green-900 relative group"
    >
      <Icons.banknoteArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      <span className="max-w-52 absolute left-1/2 -translate-x-1/2 top-full mt-4 px-4 py-2 text-sm text-gray-700 bg-gray-300 dark:text-gray-300 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-gray-300 text-wrap">
        Deposit
      </span>
    </Button>
  );
};

export default SavingDepositButton;
