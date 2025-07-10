import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { Button } from '../../../../components/ui/button';
import { X, AlertTriangle, ArrowLeft, Check } from 'lucide-react';

interface ConfirmExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmExit: () => void;
  onCancelExit: () => void;
}

const ConfirmExitDialog: React.FC<ConfirmExitDialogProps> = ({
  open,
  onOpenChange,
  onConfirmExit,
  onCancelExit,
}) => {
  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="absolute top-0 right-0 pt-2 pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelExit}
            aria-label="Close dialog"
            className="rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <AlertDialogHeader className="relative">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Confirm Exit Form
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
          Are you sure you want to exit the form?
          <br />
          The data you have entered may not be saved.
        </AlertDialogDescription>
        <AlertDialogDescription className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Click <ArrowLeft className="inline h-3 w-3 mx-0.5 text-blue-500" /> to stay back
          <br />
          Or click <Check className="inline h-3 w-3 mx-0.5 text-green-500" /> to confirm
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-6 grid grid-cols-2 gap-3">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={onCancelExit}
              className="w-full flex items-center justify-center py-3 text-sm font-semibold rounded-md border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-gray-400"
              tabIndex={0}
              aria-label="Stay on page"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={onConfirmExit}
              className="w-full flex items-center justify-center py-3 text-sm font-semibold rounded-md bg-yellow-500 hover:bg-yellow-600 text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-yellow-300"
              tabIndex={0}
              aria-label="Confirm exit"
            >
              <Check className="h-6 w-6" />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmExitDialog;
