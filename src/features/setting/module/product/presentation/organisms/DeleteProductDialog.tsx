'use client';
import { Icons } from '@/components/Icon';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check } from 'lucide-react';
import { Product } from '../../domain/entities/Product';

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteProductDialog = ({
  product,
  open,
  onOpenChange,
  onConfirm,
}: DeleteProductDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className="font-medium">{product?.name}</span> and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <TooltipProvider>
            <div className="flex justify-between gap-4 mt-6">
              {/* Cancel Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    type="button"
                    className="flex items-center justify-center gap-2 px-10 py-2 border rounded-lg transition hover:bg-gray-100"
                  >
                    <Icons.trash className=" text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>

              {/* Submit Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    onClick={onConfirm}
                    className="flex items-center justify-center gap-2 px-10 py-2 rounded-lg transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Submit</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
