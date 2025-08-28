import * as yup from 'yup';

export type DynamicFieldTier = {
  id: string;
  slug: string;
  key: string;
  label: string;
  suffix?: string;
};

export function buildDynamicTierSchema(fields: DynamicFieldTier[]) {
  const shape: Record<string, yup.AnySchema> = {};
  fields.forEach((field) => {
    shape[field.key] = yup
      .number()
      .required(`${field.label} is required`)
      .min(0, `${field.label} must be positive`)
      .max(100, `${field.label} must be less than 100`);
  });
  return yup.object({
    id: yup.string().optional(),
    slug: yup.string().optional(),
    tier: yup.string().required('Tier is required'),
    ...shape,
    story: yup.string().required('Story is required'),
    activeIcon: yup.string().required('Active icon is required'),
    inActiveIcon: yup.string().required('inActive Icon is required'),
    themeIcon: yup.string().required('Theme Icon is required'),
    mainIcon: yup.string().required('Main Icon is required'),
  });
}

export type EditMemberShipFormValues = {
  id?: string;
  tier: string;
  story: string;
  activeIcon: string;
  inActiveIcon: string;
  themeIcon: string;
  mainIcon: string;
  [key: string]: number | string | undefined;
};
