'use client';

import { LoadingIndicator } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import { CreateDepositRequestUsecase } from '../../domain/usecase';
import { setAttachmentData, setSelectedPackageId } from '../../slices';
import { fetchFrozenAmountAsyncThunk } from '../../slices/actions/GetFrozenAmountAsyncThunk';
import { WalletDialog } from '../atoms';
import { WalletPaymentDetail, WalletTopbarAction } from '../organisms';
import WalletPackageList from '../organisms/WalletPackageList';

const WalletDepositPage = () => {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.settings.currency);

  // Get deposit-related state from redux store
  const selectedId = useAppSelector((state) => state.wallet.selectedPackageId);
  const attachmentData = useAppSelector((state) => state.wallet.attachmentData);
  const packageFX = useAppSelector((state) => state.wallet.packageFX);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingNavigation = useRef<null | (() => void)>(null);

  const router = useRouter();

  // On mount, if no package is selected, auto-select the first package
  useEffect(() => {
    if (packageFX && packageFX.length > 0) {
      dispatch(setSelectedPackageId(packageFX[0].id));
    }
  }, [packageFX]);

  // Warn user if they try to reload/leave the page with unsent attachment
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (attachmentData) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [attachmentData]);

  // Navigation guard: if there is an unsent attachment, show confirm dialog before leaving
  const guardedNavigate = useCallback(
    (cb: () => void) => {
      if (attachmentData) {
        setShowLeaveModal(true);
        pendingNavigation.current = cb;
      } else {
        cb();
      }
    },
    [attachmentData],
  );

  // When selecting a different package, reset the attachment
  const handleSelect = useCallback(
    (id: string) => {
      dispatch(setSelectedPackageId(id));
      dispatch(setAttachmentData(null));
    },
    [dispatch],
  );

  // Back button: navigate to dashboard, with guard for unsent attachment
  const handleBack = () => {
    guardedNavigate(() => router.push(RouteEnum.WalletDashboard));
  };

  // Handle sending deposit request
  const handleConfirm = async () => {
    if (!selectedId || !attachmentData) return;
    setLoading(true);
    try {
      let finalAttachmentData = attachmentData;
      // If the file is local, upload to firebase before sending
      if ((attachmentData as any).file) {
        const file = (attachmentData as any).file;
        const url = await uploadToFirebase({
          file,
          path: 'wallet-attachments',
          fileName: file.name.replace(/\.[^/.]+$/, ''),
        });
        finalAttachmentData = {
          ...attachmentData,
          url,
          path: `wallet-attachments/${file.name}`,
        };
        delete (finalAttachmentData as any).file;
      }
      // Call usecase to send deposit request
      const usecase = walletContainer.get<CreateDepositRequestUsecase>(
        WALLET_TYPES.ICreateDepositRequestUseCase,
      );

      await usecase.execute(
        {
          packageFXId: selectedId,
          attachmentData: finalAttachmentData,
        },
        currency,
      );

      toast.success('Deposit request sent successfully');
      // Reset state after successful request
      dispatch(setAttachmentData(null));
      dispatch(setSelectedPackageId(null));
      dispatch(fetchFrozenAmountAsyncThunk());

      router.push(RouteEnum.WalletDashboard);
    } catch (err: any) {
      toast.error(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  // Confirm leaving page with unsent attachment
  const handleConfirmLeave = () => {
    setShowLeaveModal(false);

    if (pendingNavigation.current) {
      pendingNavigation.current();
      pendingNavigation.current = null;
    }
    dispatch(setAttachmentData(null));
    dispatch(setSelectedPackageId(null));
  };

  // Cancel leave confirmation
  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    pendingNavigation.current = null;
  };

  // Only allow confirm if a package is selected, there is an attachment, and not loading
  const canConfirm = !!selectedId && !!attachmentData && !loading;

  return (
    <div id="wallet-deposit">
      <div className="mx-auto flex justify-center pb-6">
        <div className="flex flex-col gap-6 w-full">
          <WalletTopbarAction
            enableDeposit={false}
            enableTransfer={false}
            enableWithdraw={false}
            enableFilter={false}
            searchType="deposit"
          />

          <div className="flex w-full gap-6">
            <WalletPackageList
              selectedId={selectedId}
              setSelectedId={handleSelect}
              className="w-full"
            />

            {/* Payment detail info */}
            <WalletPaymentDetail className="w-full" />
          </div>

          <div className="flex justify-between items-center gap-6">
            {/* Back to dashboard button */}
            <Button variant="outline" onClick={handleBack} className="w-40" size="lg">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>

            {/* Send deposit request button */}
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

      {/* Dialog to confirm leaving page with unsent attachment */}
      <WalletDialog
        open={showLeaveModal}
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />
    </div>
  );
};

export default WalletDepositPage;
