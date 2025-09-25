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

  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );

  const { handleSubmit } = methods;

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
              name: data.name || '',
              slug: benefitTierToEdit?.slug || '',
              description: data.description || '',
              suffix: data.unit,
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
        isLoading={isLoadingAddUpdateBenefitTier}
        isShowSubmitButtonInstruction={true}
      />
    </form>
  );
};

export default EditTierBenefitForm;
