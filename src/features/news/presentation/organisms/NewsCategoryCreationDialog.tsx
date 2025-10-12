import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { InputField } from '@/components/common/forms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, FieldError, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

export type NewsCategoryFormValues = {
  name: string;
  description?: string;
};

interface NewsCategoryCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated: (category: NewsCategoryFormValues) => void;
  isSubmitting: boolean;
}

const defaultValues: NewsCategoryFormValues = {
  name: '',
  description: '',
};

const faqCategorySchema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  description: yup.string().max(200, 'Description must be at most 200 characters'),
});

const NewsCategoryCreationDialog: React.FC<NewsCategoryCreationDialogProps> = ({
  open,
  onOpenChange,
  onCategoryCreated,
  isSubmitting = false,
}) => {
  const methods = useForm<NewsCategoryFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(faqCategorySchema),
  });
  const { handleSubmit, reset, formState: formStateMethods, setValue, getValues } = methods;

  const handleClose = () => {
    onOpenChange(false);
    reset(defaultValues);
  };

  const handleFormSubmit = () => {
    onCategoryCreated(getValues());
  };

  const handleFormChange = () => {
    setValue('name', getValues('name'));
    setValue('description', getValues('description'));
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New News Category</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please provide the name and (optionally) a description for the new category.
          </DialogDescription>
          <form
            data-test="news-category-creation-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
            onChange={handleFormChange}
          >
            <Controller
              control={methods.control}
              name="name"
              render={({ field }) => (
                <InputField
                  {...field}
                  label="News Name"
                  placeholder="Enter news name"
                  required
                  error={formStateMethods.errors.name?.message as unknown as FieldError}
                />
              )}
            />

            <Controller
              control={methods.control}
              name="description"
              render={({ field }) => (
                <InputField
                  {...field}
                  label="Description"
                  placeholder="Enter description"
                  type="textarea"
                  error={formStateMethods.errors.description?.message as unknown as FieldError}
                />
              )}
            />

            <div className="flex justify-between gap-4 mt-6">
              {/* Cancel Button */}
              <CommonTooltip content="Cancel">
                <Button
                  disabled={isSubmitting}
                  onClick={() => handleClose()}
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2 px-10 py-2 border rounded-lg transition hover:bg-gray-100"
                >
                  <Icons.trash className=" text-red-600" />
                </Button>
              </CommonTooltip>
              {/* Submit Button */}
              <CommonTooltip content={isSubmitting ? 'Submitting...' : 'Submit'}>
                <Button
                  type="submit"
                  disabled={false}
                  className="flex items-center justify-center gap-2 px-10 py-2 rounded-lg transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <Icons.spinner className="animate-spin h-5 w-5" />
                  ) : (
                    <Icons.check className="h-5 w-5" />
                  )}
                </Button>
              </CommonTooltip>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default NewsCategoryCreationDialog;
