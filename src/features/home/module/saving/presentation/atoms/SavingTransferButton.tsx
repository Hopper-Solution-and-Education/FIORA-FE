'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ChildProps = {
  click: () => void;
};

const SavingTransferButton = ({ click }: ChildProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Transfer"
            onClick={click}
            className="w-10 h-10 [&_svg]:size-6 hover:bg-orange-100 dark:hover:bg-orange-900 hover:border-orange-100 dark:hover:border-orange-900"
          >
            <Icons.arrowLeftRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Transfer</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SavingTransferButton;
