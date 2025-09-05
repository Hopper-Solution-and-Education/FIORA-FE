import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CreatedBy, UpdatedBy } from '@/shared/types';
import { Separator } from '@radix-ui/react-separator';
import { useRouter } from 'next/navigation';
import React, { JSX } from 'react';
import { Controller, FormState, Path, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { FormDetailInfo } from '../atoms';
// Defines the props for each field component in the form
export interface FieldV2Props<T extends yup.AnyObject> {
  name: Path<T>; // Name of the field, must match a key in T, ensured by Path<T>
  // Grid properties for individual fields
  gridColSpan?: number; // Number of columns this field should span
  gridRowSpan?: number; // Number of rows this field should span
  gridClassName?: string; // Custom grid classes for this field
  [key: string]: any; // Allows additional props (e.g., placeholder, disabled) for flexibility
}
interface GlobalFormProps<T extends yup.AnyObject> {
  fields: React.ReactElement<FieldV2Props<T>>[]; // Array of field components to render
  onBack?: () => void;
  renderSubmitButton?: (formState: FormState<T>) => React.ReactNode; // Optional custom submit button renderer
  methods: UseFormReturn<any>;
  isLoading?: boolean;
  // Grid layout options
  gridLayout?: boolean; // Enable grid layout
  gridCols?: number; // Number of columns (default: 1)
  gridGap?: string; // Gap between grid items (default: 'gap-4')
  // Detail info form to show in the bottom of the form
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: CreatedBy | null;
  updatedBy?: UpdatedBy | null;
}

// Generic GlobalForm component to manage and render forms
const FormConfig = <T extends yup.AnyObject>({
  fields,
  onBack,
  renderSubmitButton,
  methods,
  isLoading,
  gridLayout = false,
  gridCols = 1,
  gridGap = 'gap-4',
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
}: GlobalFormProps<T>): JSX.Element => {
  const router = useRouter();
  const { control, formState } = methods;

  const hasDetailInfo = createdBy || updatedBy;

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
              data-test="form-cancel-button"
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
              data-test="form-submit-button"
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

  // Generate grid classes based on props
  const getGridClasses = () => {
    if (!gridLayout) return '';

    const gridColsClass = `grid-cols-${gridCols}`;
    return `grid ${gridColsClass} ${gridGap}`;
  };

  const renderFields = () => {
    const fieldElements = fields.map((fieldElement) => {
      const { gridColSpan, gridRowSpan, gridClassName } = fieldElement.props;

      const fieldElementWithController = (
        <Controller
          key={fieldElement.props.name?.toString()}
          name={fieldElement.props.name}
          control={control}
          render={({ field: controllerField, fieldState: { error } }) =>
            // Clone the field element, injecting value, onChange, and error props
            React.cloneElement(fieldElement, {
              ...controllerField,
              error,
              'data-test': fieldElement.props.name ? `${fieldElement.props.name}-input` : undefined,
            })
          }
        />
      );

      // If grid layout is enabled and field has grid properties, wrap with grid classes
      if (gridLayout && (gridColSpan || gridRowSpan || gridClassName)) {
        const gridClasses = [];

        if (gridColSpan) gridClasses.push(`col-span-${gridColSpan}`);
        if (gridRowSpan) gridClasses.push(`row-span-${gridRowSpan}`);
        if (gridClassName) gridClasses.push(gridClassName);

        return (
          <div key={fieldElement.props.name?.toString()} className={gridClasses.join(' ')}>
            {fieldElementWithController}
          </div>
        );
      }

      return fieldElementWithController;
    });

    if (gridLayout) {
      return <div className={getGridClasses()}>{fieldElements}</div>;
    }

    return <>{fieldElements}</>;
  };

  return (
    <>
      {/* Render fields with optional grid layout */}
      {renderFields()}

      <Separator className="my-2 border-gray-600" />
      {hasDetailInfo && (
        <FormDetailInfo
          createdAt={createdAt}
          updatedAt={updatedAt}
          createdBy={createdBy}
          updatedBy={updatedBy}
          className="w-full"
        />
      )}

      {/* Conditionally render custom submit button or default button */}
      {renderSubmitButton ? renderSubmitButton(formState) : renderSubmitButtonDefault()}
    </>
  );
};

export default FormConfig;
