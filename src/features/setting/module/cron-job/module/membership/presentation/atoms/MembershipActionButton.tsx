import { LoadingIndicator } from '@/components/common/atoms';
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
import { useContext, useEffect, useMemo, useState } from 'react';
import { membershipCronjobContainer } from '../../di/membershipCronjobDashboardDI';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IGetMembershipTiersUseCase } from '../../domain/usecase/GetMembershipTiersUseCase';
import { IResendMembershipUseCase } from '../../domain/usecase/ResendMembershipUseCase';
import { DispatchTableContext } from '../context/DispatchTableContext';

interface MembershipActionButtonProps {
  id: string;
  status: string;
  className?: string;
}

const MembershipActionButton = ({ id, status, className }: MembershipActionButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [reason, setReason] = useState('');
  const [tierOptions, setTierOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(false);
  const { dispatchTable } = useContext(DispatchTableContext)!;
  const [isLoading, setIsLoading] = useState(false);

  const selectedTierLabel = useMemo(
    () => tierOptions.find((t) => t.value === selectedTier)?.label || '',
    [selectedTier, tierOptions],
  );

  const handleRetry = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedTier || !reason) return;
    const useCase = membershipCronjobContainer.get<IResendMembershipUseCase>(
      MEMBERSHIP_CRONJOB_TYPES.IResendMembershipUseCase,
    );
    setIsLoading(true);

    let response = null;

    try {
      response = await useCase.execute(id, { tierId: selectedTier, reason });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    dispatchTable({
      type: 'UPDATE_ROW',
      payload: {
        id,
        updates: {
          status: 'SUCCESSFUL',
          toTier: selectedTierLabel,
          reason,
          updatedBy: { id: response?.updatedBy?.id || '', email: response?.updatedBy?.email || '' },
        },
      },
    });

    setIsModalOpen(false);
    setSelectedTier('');
    setReason('');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTier('');
    setReason('');
  };

  useEffect(() => {
    if (!isModalOpen) return;
    if (tierOptions.length > 0 || loadingTiers) return;
    const fetchTiers = async () => {
      setLoadingTiers(true);
      try {
        const useCase = membershipCronjobContainer.get<IGetMembershipTiersUseCase>(
          MEMBERSHIP_CRONJOB_TYPES.IGetMembershipTiersUseCase,
        );
        const res = await useCase.execute(1, 20);
        const items = res.data?.items || [];
        setTierOptions(items.map((t) => ({ value: t.id, label: t.tierName })));
      } finally {
        setLoadingTiers(false);
      }
    };
    fetchTiers();
  }, [isModalOpen, tierOptions.length, loadingTiers]);

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

  if (status.toLowerCase() !== 'fail') {
    return null;
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRetry}
        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select new Tier <span className="text-red-500">*</span>
              </label>

              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>

                <SelectContent>
                  {tierOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
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
              disabled={isLoading}
            >
              <Icons.arrowLeft className="w-4 h-4 text-black" />
            </Button>

            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 w-full"
              disabled={!selectedTier || !reason || isLoading}
            >
              {isLoading ? <LoadingIndicator /> : <Icons.check className="w-4 h-4 text-white" />}
            </Button>
          </div>
        }
      />
    </>
  );
};

export default MembershipActionButton;
