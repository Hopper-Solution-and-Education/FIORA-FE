/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { LoadingIndicator } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
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
import { WalletDialog } from '../atoms';
import { WalletPaymentDetail, WalletTopbarAction } from '../organisms';
import WalletPackageList from '../organisms/WalletPackageList';
import { fetchFrozenAmountAsyncThunk } from '../../slices/actions/GetFrozenAmountAsyncThunk';

const WalletDepositPage = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingNavigation = useRef<null | (() => void)>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectedId = useAppSelector((state) => state.wallet.selectedPackageId);
  const attachmentData = useAppSelector((state) => state.wallet.attachmentData);
  const packageFX = useAppSelector((state) => state.wallet.packageFX);

  useEffect(() => {
    if (!selectedId && packageFX && packageFX.length > 0) {
      dispatch(setSelectedPackageId(packageFX[0].id));
    }
  }, [packageFX]);

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

  const handleSelect = (id: string) => {
    dispatch(setSelectedPackageId(id));
    dispatch(setAttachmentData(null));
  };

  const handleBack = () => {
    guardedNavigate(() => router.push(RouteEnum.WalletDashboard));
  };

  const handleConfirm = async () => {
    if (!selectedId || !attachmentData) return;
    setLoading(true);
    try {
      let finalAttachmentData = attachmentData;
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
      const usecase = walletContainer.get<CreateDepositRequestUsecase>(
        WALLET_TYPES.ICreateDepositRequestUseCase,
      );

      await usecase.execute({
        packageFXId: selectedId,
        attachmentData: finalAttachmentData,
      });

      toast.success('Deposit request sent successfully');
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

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);

    if (pendingNavigation.current) {
      pendingNavigation.current();
      pendingNavigation.current = null;
    }
    dispatch(setAttachmentData(null));
    dispatch(setSelectedPackageId(null));
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    pendingNavigation.current = null;
  };

  const canConfirm = !!selectedId && !!attachmentData && !loading;

  return (
    <div id="wallet-deposit">
      <div className="mx-auto flex justify-center pb-6">
        <div className="flex flex-col gap-6 w-full">
          <WalletTopbarAction enableDeposit={false} enableFilter={false} searchType="deposit" />

          <div className="flex w-full gap-6">
            <WalletPackageList
              selectedId={selectedId}
              setSelectedId={handleSelect}
              className="w-full"
            />

            <WalletPaymentDetail className="w-full" />
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
