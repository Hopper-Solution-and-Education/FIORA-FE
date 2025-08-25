import { FormConfig, SelectField } from '@/components/common/forms';
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
import { setIsShowDialogAddBenefitTier } from '../../slices';
import {
  addUpdateNewBenefitAsyncThunk,
  deleteBenefitAsyncThunk,
  getListMembershipAsyncThunk,
} from '../../slices/actions';
import SettingTierInputField from '../atoms/SettingTierInputField';
import { DynamicFieldTier, EditMemberShipFormValues } from '../schema/editMemberShip.schema';
import { formatLabel } from './AddBenefitTierFieldConfig';

const options = {
  percent: true,
  maxPercent: 100,
};

const deleteModes = [ProcessMembershipMode.DELETE, ProcessMembershipMode.DELETE_ALL];
const updateModes = [ProcessMembershipMode.UPDATE_ALL, ProcessMembershipMode.UPDATE];

const SettingTierInputFieldConfig = ({
  dynamicTierFields,
}: {
  dynamicTierFields: DynamicFieldTier[];
}) => {
  const methods = useFormContext<EditMemberShipFormValues>();
  const dispatch = useAppDispatch();
  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);
  const isLoadingAddUpdateBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingAddUpdateBenefitTier,
  );
  const [isShowDialogDeleteBenefitTier, setIsShowDialogDeleteBenefitTier] = useState(false);
  const [isShowDialogEditBenefitTier, setIsShowDialogEditBenefitTier] = useState(false);
  const [idTierToDelete, setIdTierToDelete] = useState<string | null>(null);
  const [idTierToEdit, setIdTierToEdit] = useState<string | null>(null);
  const [updateMode, setUpdateMode] = useState<ProcessMembershipMode>(ProcessMembershipMode.UPDATE);
  const [benefitTierToEdit, setBenefitTierToEdit] = useState<DynamicFieldTier | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);
  const { setValue, watch } = methods;
  const isLoadingDeleteBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isLoadingDeleteBenefitTier,
  );

  const [deleteMode, setDeleteMode] = useState<ProcessMembershipMode>(ProcessMembershipMode.DELETE);

  const { data: session } = useSession();

  const handleOpenDialogAddBenefitTier = () => {
    dispatch(setIsShowDialogAddBenefitTier(true));
  };

  // Render dynamic fields based on configuration
  const fields = dynamicTierFields.map((field) => {
    const fieldValue = typeof watch(field.key) === 'number' ? (watch(field.key) as number) : 0;

    return (
      <SettingTierInputField
        key={field.key}
        label={field.label}
        name={field.key}
        value={fieldValue}
        onChange={(value) => setValue(field.key, value)}
        suffix={field.suffix}
        options={options}
        required
        disabled={isLoadingAddUpdateBenefitTier || isLoadingDeleteBenefitTier}
        showRemove={dynamicTierFields.length > 1}
        onRemove={() => {
          setIsShowDialogDeleteBenefitTier(true);
          setIdTierToDelete(field.id);
          setSlugToDelete(field.slug);
          setDeleteMode(ProcessMembershipMode.DELETE);
        }}
        showEdit={dynamicTierFields.length > 1}
        onEdit={() => {
          setIsShowDialogEditBenefitTier(true);
          setIdTierToEdit(field.id);
          setBenefitTierToEdit(field);
          const current = methods.getValues()[field.key];
          setEditValue(typeof current === 'number' ? (current as number) : 0);
        }}
      />
    );
  });

  // Sticky submit button
  const renderSubmitButton = () => {
    return (
      <Button
        type="button"
        className="w-full mt-10"
        variant="outline"
        onClick={handleOpenDialogAddBenefitTier}
      >
        <Icons.add />
      </Button>
    );
  };

  return (
    <div className="relative">
      <div className="max-h-[400px] overflow-y-auto pr-2">
        <FormConfig fields={fields} methods={methods} renderSubmitButton={() => null} />
      </div>
      {renderSubmitButton()}
      <GlobalDialog
        open={isShowDialogDeleteBenefitTier}
        onOpenChange={() => setIsShowDialogDeleteBenefitTier(!isShowDialogDeleteBenefitTier)}
        renderContent={() => (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p>Are you sure you want to delete this benefit tier?</p>
              <p>This action cannot be undone.</p>
              <p>
                <span className="font-bold">Delete Mode:</span> {formatLabel(deleteMode)}
              </p>
            </div>
            <SelectField
              options={deleteModes.map((mode) => ({
                label: formatLabel(mode),
                value: mode,
              }))}
              value={deleteMode}
              required
              noneValue={false}
              onChange={(value) => setDeleteMode(value as ProcessMembershipMode)}
            />
          </div>
        )}
        customLeftButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsShowDialogDeleteBenefitTier(false)}
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
                        slug: slugToDelete || '',
                        membershipTierId: selectedMembership?.id || '',
                        membershipBenefitId: idTierToDelete,
                        mode: deleteMode,
                      }),
                    )
                      .unwrap()
                      .then(() => {
                        dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
                        setIsShowDialogDeleteBenefitTier(false);
                      })
                      .catch((error) => {
                        toast.error(error);
                        setIsShowDialogDeleteBenefitTier(false);
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

      <GlobalDialog
        open={isShowDialogEditBenefitTier}
        onOpenChange={() => setIsShowDialogEditBenefitTier(!isShowDialogEditBenefitTier)}
        renderContent={() => (
          <div className="flex flex-col gap-4">
            {benefitTierToEdit ? (
              <SettingTierInputField
                label={benefitTierToEdit.label}
                name={benefitTierToEdit.key}
                value={editValue}
                onChange={(value) => {
                  setEditValue(value);
                }}
                suffix={benefitTierToEdit.suffix}
                options={options}
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
                onClick={() => setIsShowDialogEditBenefitTier(false)}
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
                        setIsShowDialogEditBenefitTier(false);
                      })
                      .catch((error) => {
                        toast.error(error);
                        setIsShowDialogEditBenefitTier(false);
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
    </div>
  );
};

export default SettingTierInputFieldConfig;
