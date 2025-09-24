import { removeFromFirebase, uploadToFirebase } from '@/shared/lib';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { setIsLoadingUpsertMembership, setSelectedMembership } from '../../slices';
import { getListMembershipAsyncThunk } from '../../slices/actions/getMemberShipAsyncThunk';
import { upsertMembershipAsyncThunk } from '../../slices/actions/upsertMembershipAsyncThunk';
import { buildDynamicTierSchema, EditMemberShipFormValues } from '../schema/editMemberShip.schema';

export const useMembershipSettingPage = () => {
  const dispatch = useAppDispatch();

  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);

  const dynamicTierFields = useMemo(() => {
    const fields =
      selectedMembership?.tierBenefits.map((benefit) => ({
        id: benefit.id,
        slug: benefit.slug,
        key: benefit.slug,
        label: benefit.name,
        suffix: benefit.suffix,
        value: Number(benefit.value) || 0,
        description: benefit.description,
      })) ?? [];
    return fields;
  }, [selectedMembership?.tierBenefits]);

  const editMemberShipSchema = useMemo(
    () => buildDynamicTierSchema(dynamicTierFields),
    [dynamicTierFields],
  );

  const defaultEditMemberShipValue: EditMemberShipFormValues = useMemo(
    () => ({
      tier: '',
      ...Object.fromEntries(dynamicTierFields.map((f) => [f.key, 0])),
      story: '',
      activeIcon: '',
      inActiveIcon: '',
      themeIcon: '',
      mainIcon: '',
    }),
    [dynamicTierFields],
  );

  const methods = useForm<EditMemberShipFormValues>({
    resolver: yupResolver(editMemberShipSchema),
    defaultValues: defaultEditMemberShipValue,
  });

  const { setValue, reset } = methods;

  //   handle set value when selected membership change
  useEffect(() => {
    if (selectedMembership) {
      // Reset form with new schema and default values
      reset(defaultEditMemberShipValue);

      // Then set the actual values
      setValue('id', selectedMembership.id);
      setValue('tier', selectedMembership.tierName);
      setValue('story', selectedMembership.story);
      setValue('activeIcon', selectedMembership.passedIconUrl);
      setValue('inActiveIcon', selectedMembership.inactiveIconUrl);
      setValue('mainIcon', selectedMembership.mainIconUrl);
      setValue('themeIcon', selectedMembership.themeIconUrl);

      // set value dynamic for benefit fields
      (selectedMembership.tierBenefits || []).forEach((benefit) => {
        setValue(benefit.slug, Number(benefit.value ?? 0));
      });
    }
  }, [selectedMembership, setValue, reset, defaultEditMemberShipValue]);

  //   handle submit form
  const handleSubmit = async (data: EditMemberShipFormValues) => {
    try {
      dispatch(setIsLoadingUpsertMembership(true));
      // Keep track of uploaded URLs to rollback on failure
      const uploadedUrls: string[] = [];

      const uploadIconIfNeeded = async (iconUrl: string, tierName: string): Promise<string> => {
        if (iconUrl && iconUrl.startsWith('blob:')) {
          const response = await fetch(iconUrl);
          const blob = await response.blob();

          const fileName = `${tierName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
          const file = new File([blob], fileName, { type: blob.type });

          const firebaseUrl = await uploadToFirebase({
            file,
            path: 'images/membership_icons',
            fileName,
          });

          // Track uploaded file for rollback if needed
          uploadedUrls.push(firebaseUrl);

          return firebaseUrl;
        }
        return iconUrl;
      };

      // upload icon if needed
      const [updatedActiveIcon, updatedInActiveIcon, updatedThemeIcon, updatedMainIcon] =
        await Promise.all([
          uploadIconIfNeeded(data.activeIcon, data.tier),
          uploadIconIfNeeded(data.inActiveIcon, data.tier),
          uploadIconIfNeeded(data.themeIcon, data.tier),
          uploadIconIfNeeded(data.mainIcon, data.tier),
        ]);

      // update data
      const updatedData = {
        ...data,
        activeIcon: updatedActiveIcon,
        inActiveIcon: updatedInActiveIcon,
        themeIcon: updatedThemeIcon,
        mainIcon: updatedMainIcon,
      };

      // handle update and then call get list to mapping data again, and then set selected membership
      dispatch(upsertMembershipAsyncThunk(updatedData))
        .unwrap()
        .then((response) => {
          // get list membership and then set selected membership
          dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }))
            .unwrap()
            .then(() => {
              // then set selected membership
              const selectedMemberShip = response.data;
              dispatch(
                setSelectedMembership({
                  id: selectedMemberShip.id,
                  mainIconUrl: selectedMemberShip.mainIconUrl,
                  passedIconUrl: selectedMemberShip.passedIconUrl,
                  inactiveIconUrl: selectedMemberShip.inactiveIconUrl,
                  themeIconUrl: selectedMemberShip.themeIconUrl,
                  tierBenefits: selectedMemberShip.tierBenefits.map((benefit) => ({
                    ...benefit,
                    value: Number(benefit.value),
                  })),
                  story: selectedMemberShip.story,
                  tierName: selectedMemberShip.tierName,
                  balanceMaxThreshold: selectedMemberShip.balanceMaxThreshold,
                  balanceMinThreshold: selectedMemberShip.balanceMinThreshold,
                  spentMaxThreshold: selectedMemberShip.spentMaxThreshold,
                  spentMinThreshold: selectedMemberShip.spentMinThreshold,
                  createdAt: selectedMemberShip.createdAt,
                  updatedAt: selectedMemberShip.updatedAt,
                }),
              );
            })
            .catch(async (error) => {
              dispatch(setIsLoadingUpsertMembership(false));
              await Promise.all(uploadedUrls.map((url) => removeFromFirebase(url)));
              throw error;
            });
        })
        .catch(async (error) => {
          dispatch(setIsLoadingUpsertMembership(false));
          await Promise.all(uploadedUrls.map((url) => removeFromFirebase(url)));
          throw error;
        });
    } catch (error: any) {
      toast.error('Failed to upsert membership', {
        description:
          error.message || 'An image upload failed. All uploaded files have been removed.',
      });
    }
  };

  return { methods, handleSubmit, dynamicTierFields };
};
