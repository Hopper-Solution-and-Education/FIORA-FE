export interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  section?: string;
  description?: string;
  render?: (field: any, context?: any) => React.ReactNode;
}

export type FieldOverrides<T> = Partial<Record<keyof T, Partial<FormFieldProps>>>;
