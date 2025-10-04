'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ChildProps = {
  click: () => void;
};

const SavingClaimButton = ({ click }: ChildProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Claim"
            onClick={click}
            className="w-11 h-11 [&_svg]:size-6 hover:bg-red-100 dark:hover:bg-red-900 hover:border-red-100 dark:hover:border-red-900"
          >
            <Icons.banknoteArrowDown className="text-red-600 dark:text-red-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Claim</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SavingClaimButton;
