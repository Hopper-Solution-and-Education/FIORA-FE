import { FormConfig } from '@/components/common/forms';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { setIsShowDialogEditBenefitTier } from '../../slices';
import { addUpdateNewBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';
import useEditTierBenefitFieldConfig from '../config/EditTierBenefitFieldConfig';
import { EditTierBenefitFormValues } from '../schema';

const EditTierBenefitForm = () => {
  const methods = useFormContext<EditTierBenefitFormValues>();
  const fields = useEditTierBenefitFieldConfig();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);

  const benefitTierToEdit = useAppSelector(
    (state) => state.memberShipSettings.editBenefitTier.benefitTierToEdit,
  );
  const idTierToEdit = useAppSelector(
    (state) => state.memberShipSettings.editBenefitTier.idTierToEdit,
  );

  const { handleSubmit } = methods;

  console.log('data', methods.formState.isValid);

  const onSubmit = (data: EditTierBenefitFormValues) => {
    if (idTierToEdit) {
      dispatch(
        addUpdateNewBenefitAsyncThunk({
          data: {
            mode: data.mode,
            tierBenefit: {
              tierId: selectedMembership?.id || '',
              value: Number(data.value || 0),
            },
            membershipBenefit: {
              name: benefitTierToEdit?.label || '',
              slug: benefitTierToEdit?.slug || benefitTierToEdit?.key || '',
              description: '',
              suffix: benefitTierToEdit?.suffix,
              userId: session?.user?.id || '',
            },
          },
          setError: methods.setError,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
          dispatch(setIsShowDialogEditBenefitTier(false));
        })
        .catch((error) => {
          toast.error(error);
          dispatch(setIsShowDialogEditBenefitTier(false));
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormConfig
        fields={fields}
        methods={methods}
        onBack={() => dispatch(setIsShowDialogEditBenefitTier(false))}
        gridLayout
        gridGap="gap-4"
      />
    </form>
  );
};

export default EditTierBenefitForm;
