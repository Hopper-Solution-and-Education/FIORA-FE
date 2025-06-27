import { LoadingIndicator } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import type { RootState } from '@/store';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import { CreateDepositRequestUsecase } from '../../domain/usecase';
import { setDepositProofUrl, setSelectedPackageId } from '../../slices';
import { WalletDialog } from '../atoms';
import { WalletPaymentDetail, WalletTopbarAction } from '../organisms';
import WalletPackageList from '../organisms/WalletPackageList';

const WalletDepositPage = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingNavigation = useRef<null | (() => void)>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const selectedId = useSelector((state: RootState) => state.wallet.selectedPackageId);
  const depositProofUrl = useSelector((state: RootState) => state.wallet.depositProofUrl);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (depositProofUrl) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [depositProofUrl]);

  const guardedNavigate = useCallback(
    (cb: () => void) => {
      if (depositProofUrl) {
        setShowLeaveModal(true);
        pendingNavigation.current = cb;
      } else {
        cb();
      }
    },
    [depositProofUrl],
  );

  const handleSelect = (id: string) => {
    dispatch(setSelectedPackageId(id));
  };

  const handleBack = () => {
    guardedNavigate(() => router.push(RouteEnum.WalletDashboard));
  };

  const handleConfirm = async () => {
    if (!selectedId || !depositProofUrl) return;
    setLoading(true);
    try {
      const usecase = walletContainer.get<CreateDepositRequestUsecase>(
        WALLET_TYPES.ICreateDepositRequestUseCase,
      );

      await usecase.execute(selectedId, depositProofUrl);

      toast.success('Deposit request sent successfully');
      dispatch(setDepositProofUrl(null));
      dispatch(setSelectedPackageId(null));

      router.push(RouteEnum.WalletDashboard);
    } catch (err: any) {
      toast.error(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);
    dispatch(setDepositProofUrl(null));
    dispatch(setSelectedPackageId(null));
    if (pendingNavigation.current) {
      pendingNavigation.current();
      pendingNavigation.current = null;
    }
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    pendingNavigation.current = null;
  };

  const canConfirm = !!selectedId && !!depositProofUrl && !loading;

  return (
    <div id="wallet-deposit">
      <div className="max-w-7xl mx-auto flex justify-center pb-6">
        <div className="flex flex-col gap-6">
          <WalletTopbarAction enableDeposit={false} enableFilter={false} searchType="deposit" />

          <div className="flex gap-6">
            <WalletPackageList selectedId={selectedId} setSelectedId={handleSelect} />
            <WalletPaymentDetail />
          </div>

          <div className="flex justify-between items-center gap-6">
            <Button variant="outline" onClick={handleBack} className="w-40" size="lg">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="group text-lg font-semibold w-40 bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
              size="lg"
            >
              {loading ? (
                <LoadingIndicator />
              ) : (
                <Icons.check className=" text-green-300 stroke-[2] transform transition-transform duration-200 drop-shadow-sm hover:text-green-100 !h-[24px] !w-[24px]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <WalletDialog
        open={showLeaveModal}
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />
    </div>
  );
};

export default WalletDepositPage;
