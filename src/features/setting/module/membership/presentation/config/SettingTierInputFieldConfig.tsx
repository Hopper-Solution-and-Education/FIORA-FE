import { FormConfig } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';
import SettingTierInputField from '../atoms/SettingTierInputField';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';
import { useAppSelector } from '@/store';

const SettingTierInputFieldConfig = () => {
  const methods = useFormContext<EditMemberShipFormValues>();
  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );

  const { setValue, watch } = methods;

  const fields = [
    <SettingTierInputField
      key="referralBonus"
      label="Referral Bonus"
      name="referralBonus"
      value={watch('referralBonus')}
      onChange={(value) => setValue('referralBonus', value)}
      suffix="FX"
      required
      disabled={isLoadingUpsertMembership}
    />,
    <SettingTierInputField
      key="savingInterest"
      label="Saving Interest"
      name="savingInterest"
      value={watch('savingInterest')}
      onChange={(value) => setValue('savingInterest', value)}
      suffix="%/year"
      options={{ percent: true, maxPercent: 100 }}
      required
      disabled={isLoadingUpsertMembership}
    />,
    <SettingTierInputField
      key="stakingInterest"
      label="Staking Interest"
      name="stakingInterest"
      value={watch('stakingInterest')}
      onChange={(value) => setValue('stakingInterest', value)}
      suffix="%/year"
      options={{ percent: true, maxPercent: 100 }}
      required
      disabled={isLoadingUpsertMembership}
    />,
    <SettingTierInputField
      key="investmentInterest"
      label="Investment Interest"
      name="investmentInterest"
      value={watch('investmentInterest')}
      onChange={(value) => setValue('investmentInterest', value)}
      suffix="%/year"
      options={{ percent: true, maxPercent: 100 }}
      required
      disabled={isLoadingUpsertMembership}
    />,
    <SettingTierInputField
      key="loanInterest"
      label="Loan Interest"
      name="loanInterest"
      value={watch('loanInterest')}
      onChange={(value) => setValue('loanInterest', value)}
      suffix="%/year"
      options={{ percent: true, maxPercent: 100 }}
      required
      disabled={isLoadingUpsertMembership}
    />,
    <SettingTierInputField
      key="cashback"
      label="Cashback"
      name="cashback"
      value={watch('cashback')}
      onChange={(value) => setValue('cashback', value)}
      suffix="% total spent"
      options={{ percent: true, maxPercent: 100 }}
      required
      disabled={isLoadingUpsertMembership}
    />,
    <SettingTierInputField
      key="referralKickback"
      label="Referral Kickback"
      name="referralKickback"
      value={watch('referralKickback')}
      onChange={(value) => setValue('referralKickback', value)}
      suffix="% referral spent"
      options={{ percent: true, maxPercent: 100 }}
      required
      disabled={isLoadingUpsertMembership}
    />,
    <SettingTierInputField
      key="bnplFee"
      label="BNPL Fee"
      name="bnplFee"
      value={watch('bnplFee')}
      onChange={(value) => setValue('bnplFee', value)}
      suffix="FX/day"
      required
      disabled={isLoadingUpsertMembership}
    />,
  ];

  const renderSubmitButton = () => {
    return <></>;
  };

  return <FormConfig fields={fields} methods={methods} renderSubmitButton={renderSubmitButton} />;
};

export default SettingTierInputFieldConfig;
