import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Define the expected props for field components
export interface FieldProps {
  name: string;
  validation?: yup.AnySchema;
  [key: string]: any;
}

// Define a type for form values
type FormValues = Record<string, any>;

interface GlobalFormProps {
  fields: React.ReactElement<FieldProps>[]; // Array of field components with specific props
  onSubmit: (data: FormValues) => void; // Form submission handler
}

const GlobalForm: React.FC<GlobalFormProps> = ({ fields, onSubmit }) => {
  // Build Yup schema dynamically from field validations
  const schema = yup.object().shape(
    fields.reduce(
      (acc, field) => {
        const { name, validation } = field.props;
        if (validation) {
          acc[name] = validation; // Add validation to schema if provided
        }
        return acc;
      },
      {} as Record<string, yup.AnySchema>,
    ),
  );

  // Initialize React Hook Form with Yup resolver
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((fieldElement) => (
        <Controller
          key={fieldElement.props.name}
          name={fieldElement.props.name}
          control={control}
          render={({ field: controllerField, fieldState: { error } }) =>
            React.cloneElement(fieldElement, { ...controllerField, error })
          }
        />
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default GlobalForm;
