import React, { JSX } from 'react';
import { useForm, Controller, FormProvider, FormState, Path } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Defines the props for each field component in the form
export interface FieldProps<T extends yup.AnyObject> {
  name: Path<T>; // Name of the field, must match a key in T, ensured by Path<T>
  [key: string]: any; // Allows additional props (e.g., placeholder, disabled) for flexibility
}
interface GlobalFormProps<T extends yup.AnyObject> {
  fields: React.ReactElement<FieldProps<T>>[]; // Array of field components to render
  schema: yup.ObjectSchema<T>; // Yup schema defining validation rules for the form data T
  onSubmit: (data: T) => void | Promise<void>; // Handler for form submission, sync or async
  defaultValues?: Partial<T>; // Optional default values for form fields
  renderSubmitButton?: (formState: FormState<T>) => React.ReactNode; // Optional custom submit button renderer
}

// Generic GlobalForm component to manage and render forms
const GlobalForm = <T extends yup.AnyObject>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  renderSubmitButton,
}: GlobalFormProps<T>): JSX.Element => {
  // Initialize react-hook-form with the provided schema and default values
  const methods = useForm<any>({
    resolver: yupResolver(schema), // Connects Yup schema to react-hook-form for validation
    defaultValues, // Sets initial values for the form fields
  });

  const { control, handleSubmit, formState } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Map through fields to render each one with Controller */}
        {fields.map((fieldElement) => (
          <Controller
            key={fieldElement.props.name?.toString()}
            name={fieldElement.props.name}
            control={control}
            render={({ field: controllerField, fieldState: { error } }) =>
              // Clone the field element, injecting value, onChange, and error props
              React.cloneElement(fieldElement, { ...controllerField, error })
            }
          />
        ))}
        {/* Conditionally render custom submit button or default button */}
        {renderSubmitButton ? (
          renderSubmitButton(formState) // Custom button with form state
        ) : (
          // Default submit button with Tailwind styling
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        )}
      </form>
    </FormProvider>
  );
};

export default GlobalForm;
