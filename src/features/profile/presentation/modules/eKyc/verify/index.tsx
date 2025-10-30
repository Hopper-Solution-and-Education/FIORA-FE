'use client';

import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { KYC_TAB_CONFIG, MODAL_CONFIG, OTP_MODAL_CONFIG } from '@/features/profile/constant';
import { eKYC, EKYCType } from '@/features/profile/domain/entities/models/profile';
import { useGetEKYCByUserIdQuery } from '@/features/profile/store/api/profileApi';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { KYCPageType } from '../types';
import { KYCSidebar, OtpInput, RemarksInput } from './components';
import { useVerifyKYC } from './hooks/useVerifyKYC';

const VerifyKYCPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const userId = params?.userid as string;
  const id = searchParams?.get('id') ?? KYCPageType.identificationDocument;
  const { data: eKYCDataResponse, isLoading: isLoadingEKYCData } = useGetEKYCByUserIdQuery(userId);
  const [remarks, setRemarks] = useState('');
  const [otp, setOtp] = useState('');

  // Transform eKYC data by type
  const eKYCDataByType = useMemo(() => {
    const dataMap = new Map<EKYCType, eKYC>();
    eKYCDataResponse?.forEach((item: eKYC) => {
      dataMap.set(item.type, item);
    });
    return dataMap;
  }, [eKYCDataResponse]);

  // Get current active eKYC data
  const currentEKYCData = useMemo(() => {
    const typeMap: Record<string, EKYCType> = {
      [KYCPageType.identificationDocument]: EKYCType.IDENTIFICATION_DOCUMENT,
      [KYCPageType.contactInformation]: EKYCType.CONTACT_INFORMATION,
      [KYCPageType.taxInformation]: EKYCType.TAX_INFORMATION,
      [KYCPageType.bankAccount]: EKYCType.BANK_ACCOUNT,
    };
    return eKYCDataByType.get(typeMap[id]) || null;
  }, [id, eKYCDataByType]);

  // Verify hook
  const verifyHook = useVerifyKYC({ kycId: currentEKYCData?.id });

  // Prepare tab items with eKYC data
  const tabItems = useMemo(() => {
    const typeMap: Record<string, EKYCType> = {
      [KYCPageType.identificationDocument]: EKYCType.IDENTIFICATION_DOCUMENT,
      [KYCPageType.contactInformation]: EKYCType.CONTACT_INFORMATION,
      [KYCPageType.taxInformation]: EKYCType.TAX_INFORMATION,
      [KYCPageType.bankAccount]: EKYCType.BANK_ACCOUNT,
    };

    return KYC_TAB_CONFIG.map((config) => ({
      ...config,
      eKYCData: eKYCDataByType.get(typeMap[config.id]) || null,
    }));
  }, [eKYCDataByType]);

  // Prepare sidebar items
  const sidebarItems = useMemo(
    () =>
      tabItems.map((tab) => ({
        id: tab.id,
        label: tab.label,
        status: tab.eKYCData?.status,
      })),
    [tabItems],
  );

  // Modal config based on type
  const currentModalConfig = MODAL_CONFIG[verifyHook.modalType];

  // Handle modal close
  const handleModalClose = (open: boolean) => {
    if (!verifyHook.isSendingOtp) {
      verifyHook.setModalOpen(open);
      if (!open) setRemarks('');
    }
  };

  const handleOtpModalClose = (open: boolean) => {
    if (!verifyHook.isVerifying) {
      verifyHook.setOtpModalOpen(open);
      if (!open) setOtp('');
    }
  };

  const handleConfirmAction = () => {
    verifyHook.handleVerify(verifyHook.modalType === 'reject' ? remarks : undefined);
  };

  const handleOtpVerify = () => {
    if (otp.trim()) {
      verifyHook.handleVerifyOtp(otp);
    }
  };

  if (isLoadingEKYCData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8">
        <Tabs
          value={id}
          onValueChange={(value) => router.replace(`/ekyc/${userId}/verify?id=${value}`)}
          orientation="vertical"
          className="w-full"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Sidebar */}
            <KYCSidebar items={sidebarItems} />

            {/* Tab Content */}
            <div className="flex-1 min-w-0">
              {tabItems.map((tab) => {
                const Component = tab.component;
                return (
                  <TabsContent
                    key={tab.id}
                    value={tab.id}
                    className="m-0 focus-visible:outline-none"
                  >
                    <Component
                      eKYCData={tab.eKYCData as eKYC}
                      userId={userId}
                      onApprove={verifyHook.handleOpenApprove}
                      onReject={verifyHook.handleOpenReject}
                      isVerifying={verifyHook.isVerifying}
                    />
                  </TabsContent>
                );
              })}
            </div>
          </div>
        </Tabs>
      </div>

      {/* Approve/Reject Confirmation Modal */}
      <GlobalDialog
        open={verifyHook.modalOpen}
        onOpenChange={handleModalClose}
        title={currentModalConfig.title}
        description={currentModalConfig.description}
        variant={currentModalConfig.variant}
        type={currentModalConfig.type}
        confirmText={currentModalConfig.confirmText}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        isLoading={verifyHook.isSendingOtp}
        renderContent={
          verifyHook.modalType === 'reject'
            ? () => (
                <RemarksInput
                  value={remarks}
                  onChange={setRemarks}
                  disabled={verifyHook.isSendingOtp}
                />
              )
            : undefined
        }
      />

      {/* OTP Verification Modal */}
      <GlobalDialog
        open={verifyHook.otpModalOpen}
        onOpenChange={handleOtpModalClose}
        title={currentModalConfig.title}
        description={OTP_MODAL_CONFIG.description}
        variant={OTP_MODAL_CONFIG.variant}
        type={OTP_MODAL_CONFIG.type}
        confirmText={OTP_MODAL_CONFIG.confirmText}
        cancelText={OTP_MODAL_CONFIG.cancelText}
        onConfirm={handleOtpVerify}
        isLoading={verifyHook.isVerifying}
        disabled={!otp.trim()}
        renderContent={() => (
          <OtpInput
            value={otp}
            onChange={setOtp}
            onResend={verifyHook.handleSendOtp}
            disabled={verifyHook.isVerifying}
            isSendingOtp={verifyHook.isSendingOtp}
          />
        )}
      />
    </div>
  );
};

export default VerifyKYCPage;
