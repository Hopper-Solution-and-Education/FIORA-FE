import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface FlexiInterestActionButtonProps {
  id: string;
  status: string;
  initialAmount?: string;
  onRetry?: (id: string, amount: string, reason: string) => void;
  className?: string;
}

const FlexiInterestActionButton = ({
  id,
  status,
  initialAmount,
  onRetry,
  className,
}: FlexiInterestActionButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(initialAmount || '');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!amount || Number(amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ!');
      return;
    }
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do!');
      return;
    }

    setLoading(true);

    if (onRetry) {
      onRetry(id, amount, reason);
    }
    try {
      const response = await fetch(`/api/flexi-Interest?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, reason }),
      });

      let result: any;
      try {
        result = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(`Server không trả JSON: ${text}`);
      }

      console.log('✅ PUT response:', result);

      if (response.ok) {
        alert('Update success!');
      } else {
        alert('Update failed: ' + (result?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ PUT error:', err);
      alert('Có lỗi xảy ra khi gọi API: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setAmount(initialAmount || '');
      setReason('');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAmount(initialAmount || '');
    setReason('');
  };

  // Nếu status là successful thì disable nút
  if (status.toLowerCase() === 'successful') {
    return (
      <Button
        size="sm"
        variant="ghost"
        disabled
        className="h-8 w-8 p-0 text-gray-400 cursor-not-allowed"
      >
        <Icons.edit className="w-4 h-4" />
      </Button>
    );
  }

  // Nếu không fail thì không hiển thị nút
  if (status.toLowerCase() !== 'fail') {
    return null;
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRetry}
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Icons.edit className="w-4 h-4" />
        </Button>
      </div>

      <GlobalDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Edit Flexi Interest Amount"
        type="info"
        description="Update the flexi interest amount and provide a reason. This action will notify the user."
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText=""
        cancelText=""
        hideCancel={true}
        hideConfirm={true}
        renderContent={() => (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                New Interest Amount <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Enter new amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Provide a Reason <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Type your message here"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="text-sm text-black space-y-1 mb-4 flex flex-col items-center">
              <p className="flex items-center gap-1">
                Click <Icons.arrowLeft className="w-4 h-4 text-blue-600" /> to stay back
              </p>
              <p className="flex items-center gap-1">
                Or click <Icons.check className="w-4 h-4 text-green-600" /> to confirm
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
              className="bg-white border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 w-full"
              disabled={loading}
            >
              <Icons.arrowLeft className="w-4 h-4 text-black" />
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : <Icons.check className="w-4 h-4 text-white" />}
            </Button>
          </div>
        }
      />
    </>
  );
};

export default FlexiInterestActionButton;
