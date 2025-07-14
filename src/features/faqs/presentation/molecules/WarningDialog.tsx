'use client';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/shared/utils';

type WarningDialogProps = {
  open: boolean;
  onClose: () => void;
  description?: string;
  onSubmit: () => void;
  title: string;
  icon: React.ReactNode;
};

const WarningDialog = (props: WarningDialogProps) => {
  const { description = '', onClose, open, onSubmit, title, icon } = props;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'p-0 overflow-hidden border-none shadow-2xl',
          'dark:bg-gray-900 dark:text-gray-100',
          'w-[95vw] max-w-md rounded-lg sm:rounded-xl',
          'transition-all duration-200',
        )}
      >
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn(
              'rounded-full h-8 w-8 p-0',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors',
            )}
          >
            <Icons.close className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>

        <div className={cn('px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6', 'flex flex-col')}>
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div
              className={cn(
                'w-10 h-10 sm:w-12 sm:h-12 rounded-full',
                'bg-yellow-100 dark:bg-yellow-900/30',
                'text-yellow-500 dark:text-yellow-400',
                'flex items-center justify-center mb-3 sm:mb-4',
              )}
            >
              {icon}
            </div>
            <DialogTitle
              className={cn(
                'text-lg sm:text-xl font-semibold',
                'text-gray-800 dark:text-gray-100',
                'text-center',
              )}
            >
              {title}
            </DialogTitle>

            <p
              className={cn(
                'text-center text-sm sm:text-base',
                'text-gray-600 dark:text-gray-400',
                'mt-2 max-w-xs',
              )}
            >
              {description}
            </p>

            <p
              className={cn(
                'text-center text-sm sm:text-base',
                'text-gray-600 dark:text-gray-400',
                'mt-8 max-w-xs',
              )}
            >
              Click <span className="text-blue-500">←</span> to stay back
            </p>
            <p
              className={cn(
                'text-center text-sm sm:text-base',
                'text-gray-600 dark:text-gray-400',
                'max-w-xs',
              )}
            >
              Or click <span className="text-green-500">✓</span> to confirm.
            </p>
          </div>

          <div className={cn('flex gap-2 sm:gap-3 mt-2 sm:mt-4', 'flex-row')}>
            <Button
              variant="outline"
              onClick={onClose}
              className={cn(
                'flex-1 font-medium',
                'border-gray-200 dark:border-gray-700',
                'bg-transparent dark:bg-transparent',
                'text-blue-500 dark:text-blue-300',
                'hover:bg-gray-50 dark:hover:bg-gray-800',
                'order-2 sm:order-1',
              )}
              aria-label="Cancel"
            >
              <Icons.circleArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={onSubmit}
              className={cn(
                'flex-1 font-medium',
                'bg-yellow-500 hover:bg-yellow-600',
                'dark:bg-yellow-600 dark:hover:bg-yellow-700',
                'text-white dark:text-white',
                'transition-colors',
                'order-1 sm:order-2',
              )}
              aria-label="Submit"
            >
              <Icons.check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
