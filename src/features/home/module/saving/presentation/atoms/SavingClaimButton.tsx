'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

type ChildProps = {
  click: () => void;
};

const SavingClaimButton = ({ click }: ChildProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Claim"
      onClick={click}
      className="w-10 h-10 [&_svg]:size-6 hover:bg-red-100 dark:hover:bg-red-900 hover:border-red-100 dark:hover:border-red-900 relative group"
    >
      <Icons.banknoteArrowDown className="text-red-600 dark:text-red-400" />
      <span className="max-w-52 absolute right-0 top-full mt-4 px-4 py-2 text-sm text-gray-700 bg-gray-300 dark:text-gray-300 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition before:content-[''] before:absolute before:bottom-full before:right-0 before:-translate-x-[10px] before:border-8 before:border-transparent before:border-b-gray-300 text-wrap">
        Claim
      </span>
    </Button>
  );
};

export default SavingClaimButton;
