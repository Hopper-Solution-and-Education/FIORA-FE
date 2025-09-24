import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRetryReferral } from '../hooks/useRetryReferral';

interface ReferralActionButtonProps {
  status: string;
  referralId: string;
  onRetry?: (id: string, amount: string, reason: string) => void;
  className?: string;
}

const ReferralActionButton = ({ status, referralId, onRetry }: ReferralActionButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const { retryReferral, isRetrying, error, clearError } = useRetryReferral();

  const handleRetry = () => {
    clearError();
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!amount.trim() || !reason.trim()) {
      return;
    }

    try {
      const result = await retryReferral({
        id: referralId,
        amount: amount.trim(),
        reason: reason.trim(),
      });

      if (result) {
        // Call the parent callback if provided
        if (onRetry) {
          onRetry(referralId, amount.trim(), reason.trim());
        }

        setIsModalOpen(false);
        setAmount('');
        setReason('');
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to retry referral:', err);
    }
  };

  const handleCancel = () => {
    clearError();
    setIsModalOpen(false);
    setAmount('');
    setReason('');
  };

  const isFail = status.toLowerCase() === 'fail';
  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={undefined} // Tạm thời disable action
        disabled={true} // Disable tất cả actions
        className="h-8 w-8 p-0 cursor-not-allowed opacity-50 text-gray-400"
        title="Action temporarily disabled"
      >
        <Icons.edit className="w-4 h-4" />
      </Button>

      <GlobalDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Edit Amount Request"
        type="info"
        description="Are you sure you want to edit this amount request? This action cannot be undone and will notify the user"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText=""
        cancelText=""
        hideCancel={true}
        hideConfirm={true}
        renderContent={() => (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Enter Amount <span className="text-red-500 dark:text-red-400">*</span>
              </label>

              <Input
                placeholder="Type amount here"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
                disabled={isRetrying}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Provide a Reason <span className="text-red-500 dark:text-red-400">*</span>
              </label>

              <Textarea
                placeholder="Type your message here"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={isRetrying}
              />
            </div>

            <div className="text-sm text-foreground space-y-1 mb-4 flex flex-col items-center">
              <p className="flex items-center gap-1">
                Click <Icons.arrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" /> to
                stay back
              </p>

              <p className="flex items-center gap-1">
                Or click <Icons.check className="w-4 h-4 text-green-600 dark:text-green-400" /> to
                confirm
              </p>
            </div>
          </div>
        )}
        footer={
          <div className="flex justify-between w-full gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-background border-border hover:bg-muted rounded-lg px-4 py-2 w-full"
              disabled={isRetrying}
            >
              <Icons.arrowLeft className="w-4 h-4 text-foreground" />
            </Button>

            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 w-full"
              disabled={isRetrying || !amount.trim() || !reason.trim()}
            >
              {isRetrying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icons.check className="w-4 h-4 text-white" />
              )}
            </Button>
          </div>
        }
      />
    </>
  );
};

export default ReferralActionButton;
