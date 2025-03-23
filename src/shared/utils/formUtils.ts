import * as Yup from 'yup';
import { FormFieldProps } from '../types/formsheet.type';

export const generateFieldsFromSchema = (
  schema: Yup.AnyObjectSchema,
  overrides: Partial<Record<string, Partial<FormFieldProps>>> = {},
): FormFieldProps[] => {
  const schemaDescription = schema.describe();

  const toTitleCase = (str: string) =>
    str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

  return Object.keys(schemaDescription.fields).map((key) => {
    const field = schemaDescription.fields[key] as Yup.SchemaDescription;
    const override = overrides[key] || {};

    const baseField: FormFieldProps = {
      name: key,
      label: override.label || toTitleCase(key),
      placeholder: override.placeholder || `Enter ${key.toLowerCase()}`,
      required: !field.optional,
      type:
        override.type ||
        (field.type === 'string' && key === 'email'
          ? 'email'
          : field.type === 'string'
            ? 'text'
            : undefined),
      section: override.section || 'General Information',
    };

    return {
      ...baseField,
      ...override,
    };
  });
};
