'use client';

import { Icons } from '@/components/Icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/shared/utils';
import { useRouter } from 'next/navigation';
import { TabActionHeaderProps } from '../../../../presentation/types';

export const TabActionHeader = ({
  title,
  description,
  buttonLabel,
  redirectPath,
}: TabActionHeaderProps) => {
  const router = useRouter();

  const buttonContent = (
    <>
      <Icons.add className="h-6 w-6" />
      {buttonLabel && <span className="ml-2">{buttonLabel}</span>}
    </>
  );

  const button = (
    <button
      onClick={() => router.push(redirectPath)}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'bg-blue-500 hover:bg-blue-700 text-white',
        'p-2 text-base rounded-full',
      )}
      aria-label={buttonLabel || 'Add new'}
    >
      {buttonContent}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {buttonLabel ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="top">{buttonLabel}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          button
        )}
      </div>

      <Separator />
    </div>
  );
};
