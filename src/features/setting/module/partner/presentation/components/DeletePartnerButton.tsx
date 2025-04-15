'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDeletePartner } from '@/features/setting/hooks/useDeletePartner';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/store';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { Icons } from '@/components/Icon';
import { cn } from '@/shared/utils';

interface DeletePartnerButtonProps {
  partnerId: string;
  partnerName: string;
  partner: Partner;
}

export default function DeletePartnerButton({
  partnerId,
  partnerName,
  partner,
}: DeletePartnerButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { handleDelete, isDeleting } = useDeletePartner();
  const [replacementPartnerId, setReplacementPartnerId] = useState<string>('');

  const partners = useAppSelector((state) => state.partner.partners);
  const availablePartners = partners.filter((p) => p.id !== partnerId);

  const hasTransactions = partner.transactions && partner.transactions.length > 0;
  const hasSubPartners = partner?.children && partner.children.length > 0;

  useEffect(() => {
    if (!isConfirmOpen) {
      setReplacementPartnerId('');
    }
  }, [isConfirmOpen]);

  const handleDeleteClick = () => {
    if (hasSubPartners) {
      toast.error('Please delete the subpartners first!');
      return;
    }

    setIsConfirmOpen(true);
  };

  const onDelete = async () => {
    try {
      if (hasTransactions && !replacementPartnerId) {
        toast.error('Please select a replacement partner for transactions.');
        return;
      }

      await handleDelete(partnerId, hasTransactions ? replacementPartnerId : undefined);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDeleteClick}
        className="flex items-center gap-1"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent
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
              onClick={() => setIsConfirmOpen(false)}
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
                  'bg-red-100 dark:bg-red-900/30',
                  'flex items-center justify-center mb-3 sm:mb-4',
                )}
              >
                <Icons.warning
                  className={cn('h-5 w-5 sm:h-6 sm:w-6', 'text-red-500 dark:text-red-400')}
                />
              </div>
              <AlertDialogTitle
                className={cn(
                  'text-lg sm:text-xl font-semibold',
                  'text-gray-800 dark:text-gray-100',
                  'text-center',
                )}
              >
                Delete {partnerName}
              </AlertDialogTitle>

              <AlertDialogDescription>
                {hasSubPartners ? (
                  // If partner has sub-partners, show warning and don't show any other options
                  <p
                    className={cn(
                      'text-center text-sm sm:text-base',
                      'text-red-500 font-medium',
                      'mt-2 max-w-xs',
                    )}
                  >
                    Warning: {partnerName} has sub-partners. You must delete all sub-partners first.
                  </p>
                ) : (
                  // Only if partner doesn't have sub-partners, proceed with normal deletion flow
                  <>
                    <p
                      className={cn(
                        'text-center text-sm sm:text-base',
                        'text-gray-600 dark:text-gray-400',
                        'mt-2 max-w-xs',
                      )}
                    >
                      You are going to delete this partner. This action cannot be undone.
                    </p>

                    {!hasTransactions && (
                      <>
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
                          Or click <span className="text-green-500">✓</span> to confirm delete.
                        </p>
                      </>
                    )}

                    {/* Only show replacement partner selection if there are transactions */}
                    {hasTransactions && (
                      <div
                        className={cn(
                          'mt-4 mb-4 sm:mb-6',
                          'bg-gray-50 dark:bg-gray-800/50',
                          'p-3 sm:p-4 rounded-lg',
                          'border border-gray-100 dark:border-gray-700',
                        )}
                      >
                        <p
                          className={cn(
                            'text-sm font-medium',
                            'text-amber-500 dark:text-amber-400',
                            'mb-3',
                          )}
                        >
                          This partner has associated transactions. Please select a replacement
                          partner:
                        </p>
                        <Label
                          htmlFor="replacement-partner"
                          className={cn(
                            'block text-sm font-medium',
                            'text-gray-700 dark:text-gray-300',
                            'mb-2',
                          )}
                        >
                          Replacement Partner
                        </Label>
                        <Select
                          value={replacementPartnerId}
                          onValueChange={setReplacementPartnerId}
                        >
                          <SelectTrigger
                            id="replacement-partner"
                            className="w-full bg-white dark:bg-gray-800"
                          >
                            <SelectValue placeholder="Select a replacement partner" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]" position="popper">
                            {availablePartners.length > 0 ? (
                              availablePartners.map((partner) => (
                                <SelectItem key={partner.id} value={partner.id}>
                                  {partner.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-muted-foreground">
                                No other partners available. Please create another partner first.
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}
              </AlertDialogDescription>
            </div>

            <div className={cn('flex gap-2 sm:gap-3 mt-2 sm:mt-4', 'flex-col sm:flex-row')}>
              <Button
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                className={cn(
                  'flex-1 font-medium',
                  'border-gray-200 dark:border-gray-700',
                  'bg-transparent dark:bg-transparent',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-50 dark:hover:bg-gray-800',
                  'order-2 sm:order-1',
                )}
                aria-label="Cancel"
              >
                <Icons.circleArrowLeft className="h-4 w-4 mr-2" />
                <span>Cancel</span>
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={
                  isDeleting ||
                  hasSubPartners ||
                  (hasTransactions && (!replacementPartnerId || availablePartners.length === 0))
                }
                className={cn(
                  'flex-1 font-medium',
                  'bg-red-500 hover:bg-red-600',
                  'dark:bg-red-600 dark:hover:bg-red-700',
                  'transition-colors',
                  'order-1 sm:order-2',
                )}
                aria-label="Delete"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </span>
                ) : (
                  <>
                    <Icons.check className="h-4 w-4 mr-2" />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
