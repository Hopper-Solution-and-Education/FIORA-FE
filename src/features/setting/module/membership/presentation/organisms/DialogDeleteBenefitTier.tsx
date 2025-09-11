import { RadioField } from '@/components/common/forms/radio';
import { GlobalDialog } from '@/components/common/molecules';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProcessMembershipMode } from '../../data/api';
import { setIsShowDialogDeleteBenefitTier } from '../../slices';
import { deleteBenefitAsyncThunk, getListMembershipAsyncThunk } from '../../slices/actions';

const DialogDeleteBenefitTier = () => {
  const isShowDialogDeleteBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.deleteBenefitTier.isShowDialogDeleteBenefitTier,
  );
  const idTierToDelete = useAppSelector(
    (state) => state.memberShipSettings.deleteBenefitTier.idTierToDelete,
  );
  const slugTierToDelete = useAppSelector(
    (state) => state.memberShipSettings.deleteBenefitTier.slugTierToDelete,
  );
  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);
  const [deleteMode, setDeleteMode] = useState<ProcessMembershipMode>(ProcessMembershipMode.DELETE);
  const isLoadingDeleteBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingDeleteBenefitTier,
  );
  const dispatch = useAppDispatch();

  return (
    <GlobalDialog
      open={isShowDialogDeleteBenefitTier}
      onOpenChange={() =>
        dispatch(setIsShowDialogDeleteBenefitTier(!isShowDialogDeleteBenefitTier))
      }
      renderContent={() => (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>Are you sure you want to delete this benefit tier?</p>
            <p>This action cannot be undone.</p>
          </div>
          {/* <SelectField
            options={deleteModes.map((mode) => ({
              label: formatLabel(mode),
              value: mode,
            }))}
            value={deleteMode}
            required
            noneValue={false}
            onChange={(value) => setDeleteMode(value as ProcessMembershipMode)}
          /> */}
          <RadioField
            key="deleteMode"
            name="deleteMode"
            options={[
              {
                label: 'This Tier Only',
                value: ProcessMembershipMode.DELETE,
              },
              {
                label: 'All Tier',
                value: ProcessMembershipMode.DELETE_ALL,
              },
            ]}
            value={deleteMode}
            onChange={(value) => setDeleteMode(value as ProcessMembershipMode)}
            orientation="horizontal"
            variant="card"
            equalWidth
          />
          <div className="space-y-1 text-center">
            <p className="text-base">
              Click <Icons.circleArrowLeft className="inline h-4 w-4 text-blue-600 align-[-2px]" />{' '}
              to stay back
            </p>
            <p className="text-base">
              Or click <Icons.check className="inline h-4 w-4 text-green-600 align-[-2px]" /> to
              confirm
            </p>
          </div>
        </div>
      )}
      customLeftButton={
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              type="button"
              onClick={() => dispatch(setIsShowDialogDeleteBenefitTier(false))}
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
                if (idTierToDelete) {
                  dispatch(
                    deleteBenefitAsyncThunk({
                      slug: slugTierToDelete || '',
                      membershipTierId: selectedMembership?.id || '',
                      membershipBenefitId: idTierToDelete,
                      mode: deleteMode,
                    }),
                  )
                    .unwrap()
                    .then(() => {
                      dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
                      dispatch(setIsShowDialogDeleteBenefitTier(false));
                      setDeleteMode(ProcessMembershipMode.DELETE);
                    })
                    .catch((error) => {
                      toast.error(error);
                      dispatch(setIsShowDialogDeleteBenefitTier(false));
                    });
                }
              }}
              disabled={isLoadingDeleteBenefitTier}
              className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoadingDeleteBenefitTier ? (
                <Icons.spinner className="animate-spin h-5 w-5" />
              ) : (
                <Icons.check className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLoadingDeleteBenefitTier ? 'Submiting...' : 'Submit'}</p>
          </TooltipContent>
        </Tooltip>
      }
      isLoading={isLoadingDeleteBenefitTier}
    />
  );
};

export default DialogDeleteBenefitTier;
