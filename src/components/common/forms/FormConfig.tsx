import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import React, { JSX } from 'react';
import { Controller, FormState, Path, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

// Defines the props for each field component in the form
export interface FieldV2Props<T extends yup.AnyObject> {
  name: Path<T>; // Name of the field, must match a key in T, ensured by Path<T>
  [key: string]: any; // Allows additional props (e.g., placeholder, disabled) for flexibility
}
interface GlobalFormProps<T extends yup.AnyObject> {
  fields: React.ReactElement<FieldV2Props<T>>[]; // Array of field components to render
  onBack?: () => void;
  renderSubmitButton?: (formState: FormState<T>) => React.ReactNode; // Optional custom submit button renderer
  methods: UseFormReturn<any>;
  isLoading?: boolean;
}

// Generic GlobalForm component to manage and render forms
const FormConfig = <T extends yup.AnyObject>({
  fields,
  onBack,
  renderSubmitButton,
  methods,
  isLoading,
}: GlobalFormProps<T>): JSX.Element => {
  const router = useRouter();
  const { control, formState } = methods;

  const renderSubmitButtonDefault = () => (
    <TooltipProvider>
      <div className="flex justify-between gap-4 mt-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              type="button"
              onClick={() => (onBack ? onBack() : router.back())}
              className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
            >
              <Icons.circleArrowLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cancel and go back</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              disabled={!formState.isValid || formState.isSubmitting || formState.isValidating}
              className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {formState.isSubmitting || isLoading ? (
                <Icons.spinner className="animate-spin h-5 w-5" />
              ) : (
                <Icons.check className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formState.isSubmitting ? 'Submiting...' : 'Submit'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <>
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
      {renderSubmitButton ? renderSubmitButton(formState) : renderSubmitButtonDefault()}
    </>
  );
};

export default FormConfig;
