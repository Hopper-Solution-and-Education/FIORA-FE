'use client';

import { Separator } from '@/components/ui/separator';
import {
  EKYCStatus,
  EKYCType,
  UserProfile,
} from '@/features/profile/domain/entities/models/profile';
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useSendProfileOTPMutation,
} from '@/features/profile/store/api/profileApi';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useMemo, useState } from 'react';
import { toast } from 'sonner';
import SectionHeader from '../atoms/SectionHeader';
import SettingFieldItem from '../atoms/SettingFieldItem';

import {
  ChangePasswordDialog,
  DeleteAccountOtpDialog,
  DeleteAccountWarningDialog,
} from '../molecules/dialogs';
import ChangeEmailDialog from '../molecules/dialogs/ChangeEmailDialog';
import KYCStatusList from '../molecules/KYCStatusList';
import SettingSection from '../molecules/SettingSection';
import TwoFactorAuthField from '../molecules/TwoFactorAuthField';

interface SettingTabProps {
  profile?: UserProfile;
}

type DialogType = 'email' | 'phone' | 'password' | null;
type DeleteStep = 'warning' | 'otp' | null;

const SettingTab: FC<SettingTabProps> = ({ profile }) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>(null);

  // API Mutations
  const [sendProfileOTP, { isLoading: isSendingOTP }] = useSendProfileOTPMutation();
  const [changeEmail, { isLoading: isChangingEmail }] = useChangeEmailMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();

  // Build eKYC status map
  const eKYCStatuses = useMemo(() => {
    const statusMap: Record<EKYCType, EKYCStatus | undefined> = {
      [EKYCType.IDENTIFICATION_DOCUMENT]: undefined,
      [EKYCType.CONTACT_INFORMATION]: undefined,
      [EKYCType.TAX_INFORMATION]: undefined,
      [EKYCType.BANK_ACCOUNT]: undefined,
    };

    if (profile?.eKYC) {
      profile.eKYC.forEach((kyc) => {
        statusMap[kyc.type] = kyc.status;
      });
    }

    return statusMap;
  }, [profile?.eKYC]);
  console.log('🚀 ~ SettingTab ~ eKYCStatuses:', eKYCStatuses);

  const handleNavigateToKYC = (route: string) => {
    router.push(`/profile/ekyc?id=${route}`);
  };

  // Check if contact eKYC is verified
  const isContactVerified = useMemo(() => {
    return eKYCStatuses[EKYCType.CONTACT_INFORMATION] === EKYCStatus.APPROVAL;
  }, [eKYCStatuses]);

  const handleChangePassword = () => {
    setOpenDialog('password');
  };

  const handleDeleteAccount = () => {
    setDeleteStep('warning');
  };

  const handleConfirmDeleteWarning = async () => {
    // Send OTP
    try {
      await sendProfileOTP({ type: 'delete' }).unwrap();
      toast.success('OTP sent to your email');
      // Open OTP dialog
      setDeleteStep('otp');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send OTP');
      setDeleteStep(null);
    }
  };

  // OTP Handlers
  const handleSendOTPForEmail = async () => {
    try {
      await sendProfileOTP({ type: 'email' }).unwrap();
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResendOTPForDelete = async () => {
    try {
      await sendProfileOTP({ type: 'delete' }).unwrap();
      toast.success('OTP resent to your email');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to resend OTP');
    }
  };

  // Dialog Confirm Handlers
  const handleConfirmChangeEmail = async (newEmail: string, otp: string) => {
    try {
      await changeEmail({ newEmail, otp }).unwrap();
      toast.success('Email changed successfully');
      setOpenDialog(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change email');
    }
  };

  const handleConfirmChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed successfully');
      setOpenDialog(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  const handleConfirmDeleteAccount = async (otp: string) => {
    try {
      await deleteAccount({ otp }).unwrap();
      toast.success('Account deleted successfully');
      setDeleteStep(null);
      // Redirect to login or home page
      router.push('/');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="bg-white rounded-lg py-6 lg:py-8">
      <div className="space-y-6">
        {/* KYC Header with Status List */}
        <SectionHeader title="KYC">
          <KYCStatusList eKYCStatuses={eKYCStatuses} onNavigate={handleNavigateToKYC} />
        </SectionHeader>

        {/* Contact Info Section */}
        <SettingSection title="Contact Info">
          <SettingFieldItem
            label="Email"
            description={
              isContactVerified
                ? 'Use email to protect your transactions and account.'
                : 'Complete Contact Information eKYC to change email.'
            }
            icon={
              isContactVerified ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )
            }
            showEdit={false}
            // onEdit={handleEditEmail}
            // editTooltip={isContactVerified ? 'Edit email' : 'Verify contact info first'}
            // disabled={!isContactVerified}
          />

          <SettingFieldItem
            label="Phone Number"
            description={
              isContactVerified
                ? 'Use your phone number to protect your transactions and account.'
                : 'Complete Contact Information eKYC to change phone number.'
            }
            icon={
              isContactVerified ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )
            }
            editTooltip={isContactVerified ? 'Edit phone number' : 'Verify contact info first'}
            disabled={!isContactVerified}
          />
        </SettingSection>

        <Separator />

        {/* Two-Factor Authentication Section */}
        <SettingSection title="Two-Factor Authentication">
          <TwoFactorAuthField />
        </SettingSection>

        <Separator />

        {/* Security Settings Section */}
        <SettingSection title="Security Settings">
          <SettingFieldItem
            label="Change password"
            description="This action is irreversible. Once your account is deleted, you will lose access to it and your transaction history permanently."
            icon={<AlertCircle className="w-4 h-4" />}
            onEdit={handleChangePassword}
            editTooltip="Change password"
          />

          <SettingFieldItem
            label="Delete account"
            description="Please note that you cannot undo this once you have deleted your account. Once deleted, you will not be able to access your account or view your transaction history."
            icon={<AlertCircle className="w-4 h-4" />}
            onEdit={handleDeleteAccount}
            editTooltip="Delete account"
            variant="danger"
          />
        </SettingSection>
      </div>

      {/* Dialogs */}
      <ChangeEmailDialog
        open={openDialog === 'email'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        currentEmail={profile?.email}
        onConfirm={handleConfirmChangeEmail}
        onSendOTP={handleSendOTPForEmail}
        isLoading={isChangingEmail}
        isSendingOTP={isSendingOTP}
      />

      <ChangePasswordDialog
        open={openDialog === 'password'}
        onOpenChange={(open: boolean) => !open && setOpenDialog(null)}
        onConfirm={handleConfirmChangePassword}
        isLoading={isChangingPassword}
      />

      <DeleteAccountWarningDialog
        open={deleteStep === 'warning'}
        onOpenChange={(open: boolean) => !open && setDeleteStep(null)}
        onConfirm={handleConfirmDeleteWarning}
        isLoading={isSendingOTP}
      />

      <DeleteAccountOtpDialog
        open={deleteStep === 'otp'}
        onOpenChange={(open: boolean) => !open && setDeleteStep(null)}
        onConfirm={handleConfirmDeleteAccount}
        onResendOTP={handleResendOTPForDelete}
        isLoading={isDeletingAccount}
        isSendingOTP={isSendingOTP}
      />
    </div>
  );
};

export default SettingTab;
