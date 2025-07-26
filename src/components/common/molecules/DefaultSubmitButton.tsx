'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DefaultSubmitButtonProps {
  isSubmitting?: boolean;
  disabled?: boolean;
  onBack?: () => void;
  onSubmit?: () => void;
  backTooltip?: string;
  submitTooltip?: string;
}

const DefaultSubmitButton = ({
  isSubmitting = false,
  disabled = false,
  onBack,
  onSubmit,
  backTooltip,
  submitTooltip,
}: DefaultSubmitButtonProps) => {
  return (
    <TooltipProvider>
      <div className="flex justify-between gap-4 mt-6">
        {onBack ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                type="button"
                onClick={onBack}
                className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                <Icons.circleArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{backTooltip || 'Cancel and go back'}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="w-32 h-12" />
        )}

        {onSubmit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSubmit}
                disabled={disabled || isSubmitting}
                className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <Icons.spinner className="animate-spin h-5 w-5" />
                ) : (
                  <Icons.check className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSubmitting ? 'Submiting...' : submitTooltip || 'Submit'}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default DefaultSubmitButton;
