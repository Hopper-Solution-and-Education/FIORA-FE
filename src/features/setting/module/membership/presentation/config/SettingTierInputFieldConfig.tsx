import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store';
import {
  setBenefitTierToEdit,
  setIdTierToDelete,
  setIdTierToEdit,
  setIsShowDialogAddBenefitTier,
  setIsShowDialogDeleteBenefitTier,
  setIsShowDialogEditBenefitTier,
  setSlugTierToDelete,
} from '../../slices';
import { TierBenefitTable } from '../molecules';
import { DynamicFieldTier } from '../schema/editMemberShip.schema';

const SettingTierInputFieldConfig = ({
  dynamicTierFields,
}: {
  dynamicTierFields: DynamicFieldTier[];
}) => {
  const dispatch = useAppDispatch();

  const handleOpenDialogAddBenefitTier = () => {
    dispatch(setIsShowDialogAddBenefitTier(true));
  };

  // Sticky submit button
  const renderSubmitButton = () => {
    return (
      <Button
        type="button"
        className="w-full"
        variant="outline"
        onClick={handleOpenDialogAddBenefitTier}
      >
        <Icons.add />
      </Button>
    );
  };

  return (
    <div className="relative">
      <div className="pr-2">
        {/* <FormConfig fields={fields} methods={methods} renderSubmitButton={() => null} /> */}
        <TierBenefitTable
          dynamicTierFields={dynamicTierFields}
          onEditBenefitTier={(item) => {
            dispatch(setIsShowDialogEditBenefitTier(true));
            dispatch(setIdTierToEdit(item.id));
            dispatch(setBenefitTierToEdit(item));
          }}
          onDeleteBenefitTier={(item) => {
            dispatch(setIsShowDialogDeleteBenefitTier(true));
            dispatch(setIdTierToDelete(item.id));
            dispatch(setSlugTierToDelete(item.slug));
          }}
        />
      </div>
      {renderSubmitButton()}
    </div>
  );
};

export default SettingTierInputFieldConfig;
