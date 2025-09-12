import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface MembershipActionButtonProps {
  status: string;
  toTier?: string;
  onRetry?: (id: string) => void;
  className?: string;
}

const MembershipActionButton = ({
  status,
  toTier,
  onRetry,
  className,
}: MembershipActionButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(toTier || '');
  const [reason, setReason] = useState('');

  // Mock tier options - replace with actual API call later
  const mockTierOptions = [
    'Platinum Qili',
    'Gold Qili',
    'Silver Qili',
    'Bronze Qili',
    'Titan Egg',
    'Diamond Egg',
  ];

  const handleRetry = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (onRetry) {
      // TODO: Get the actual membership ID from context or props
      onRetry('membership-id');
    }
    setIsModalOpen(false);
    setSelectedTier('');
    setReason('');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTier(toTier || '');
    setReason('');
  };

  // Show disabled button for successful status
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

  // Show action button for failed status
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
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select new Tier <span className="text-red-500">*</span>
              </label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {mockTierOptions.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            >
              <Icons.arrowLeft className="w-4 h-4 text-black" />
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 w-full"
            >
              <Icons.check className="w-4 h-4 text-white" />
            </Button>
          </div>
        }
      />
    </>
  );
};

export default MembershipActionButton;
