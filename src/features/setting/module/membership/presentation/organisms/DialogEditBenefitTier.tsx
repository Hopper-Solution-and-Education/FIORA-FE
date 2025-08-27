import { SelectField } from '@/components/common/forms';
import { GlobalDialog } from '@/components/common/molecules';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { ProcessMembershipMode } from '../../data/api';
import { setEditValue, setIsShowDialogEditBenefitTier } from '../../slices';
import { addUpdateNewBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';
import SettingTierInputField from '../atoms/SettingTierInputField';
import { formatLabel } from '../config/AddBenefitTierFieldConfig';
import { EditMemberShipFormValues } from '../schema';

const updateModes = [ProcessMembershipMode.UPDATE_ALL, ProcessMembershipMode.UPDATE];

const DialogEditBenefitTier = () => {
  const methods = useFormContext<EditMemberShipFormValues>();
  const isShowDialogEditBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.editBenefitTier.isShowDialogEditBenefitTier,
  );
  const benefitTierToEdit = useAppSelector(
    (state) => state.memberShipSettings.editBenefitTier.benefitTierToEdit,
  );
  const idTierToEdit = useAppSelector(
    (state) => state.memberShipSettings.editBenefitTier.idTierToEdit,
  );
  const editValue = useAppSelector((state) => state.memberShipSettings.editBenefitTier.editValue);
  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );
  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);
  const [updateMode, setUpdateMode] = useState<ProcessMembershipMode>(ProcessMembershipMode.UPDATE);

  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  return (
    <GlobalDialog
      open={isShowDialogEditBenefitTier}
      onOpenChange={() => dispatch(setIsShowDialogEditBenefitTier(!isShowDialogEditBenefitTier))}
      renderContent={() => (
        <div className="flex flex-col gap-4">
          {benefitTierToEdit ? (
            <SettingTierInputField
              label={benefitTierToEdit.label}
              name={benefitTierToEdit.key}
              value={editValue}
              onChange={(value) => {
                dispatch(setEditValue(value));
              }}
              suffix={benefitTierToEdit.suffix}
              required
              disabled={isLoadingAddUpdateBenefitTier}
            />
          ) : (
            <p>No benefit tier selected.</p>
          )}
          <SelectField
            options={updateModes.map((field) => ({
              label: formatLabel(field),
              value: field,
            }))}
            value={updateMode}
            onChange={(value) => setUpdateMode(value as ProcessMembershipMode)}
            required
            noneValue={false}
            disabled={isLoadingAddUpdateBenefitTier}
          />
        </div>
      )}
      customLeftButton={
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              type="button"
              onClick={() => dispatch(setIsShowDialogEditBenefitTier(false))}
              className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
            >
              <Icons.circleArrowLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cancel and go back</p>
          </TooltipContent>
        </Tooltip>
      }
      customRightButton={
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                if (idTierToEdit) {
                  dispatch(
                    addUpdateNewBenefitAsyncThunk({
                      data: {
                        mode: updateMode,
                        tierBenefit: {
                          tierId: selectedMembership?.id || '',
                          value: Number(editValue || 0),
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
              }}
              disabled={isLoadingAddUpdateBenefitTier}
              className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoadingAddUpdateBenefitTier ? (
                <Icons.spinner className="animate-spin h-5 w-5" />
              ) : (
                <Icons.check className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLoadingAddUpdateBenefitTier ? 'Submiting...' : 'Submit'}</p>
          </TooltipContent>
        </Tooltip>
      }
      isLoading={isLoadingAddUpdateBenefitTier}
    />
  );
};

export default DialogEditBenefitTier;
