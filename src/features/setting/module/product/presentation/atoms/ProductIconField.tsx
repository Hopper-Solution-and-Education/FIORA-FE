import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isImageFile, isUrl } from '@/lib/utils';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useFormContext, type Control } from 'react-hook-form';
import { ProductFormValues } from '../schema/addProduct.schema';
import IconSelect from './IconSelect';
import IconUploader from './IconUploader';

interface ProductIconFieldProps {
  control: Control<ProductFormValues>;
}

type ProductIconFormType = 'dropdown' | 'uploader';

const ProductIconField = ({ control }: ProductIconFieldProps) => {
  const { setValue, watch } = useFormContext<ProductFormValues>();
  const fieldValue = watch('icon');

  // Xác định tab dựa trên giá trị icon
  const [selectedTab, setSelectedTab] = useState<ProductIconFormType>(
    fieldValue && isUrl(fieldValue) ? 'uploader' : 'dropdown',
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [nextTab, setNextTab] = useState<ProductIconFormType | null>(null);

  useEffect(() => {
    if (fieldValue) {
      setSelectedTab(isUrl(fieldValue) || isImageFile(fieldValue) ? 'uploader' : 'dropdown');
    }
  }, [fieldValue]);

  const handleOnTabChange = (newTab: string) => {
    if (!isEmpty(fieldValue) && newTab !== selectedTab) {
      setNextTab(newTab as ProductIconFormType);
      setIsAlertOpen(true);
    } else {
      setSelectedTab(newTab as ProductIconFormType);
    }
  };

  const confirmTabChange = () => {
    if (nextTab) {
      setValue('icon', '', { shouldValidate: true });
      setSelectedTab(nextTab);
      setIsAlertOpen(false);
      setNextTab(null);
    }
  };

  const cancelTabChange = () => {
    setIsAlertOpen(false);
    setNextTab(null);
  };

  return (
    <FormField
      control={control}
      name="icon"
      render={({ field }) => (
        <FormItem className="col-span-2">
          <label className="block text-sm font-medium mb-2">
            Icon <span className="text-red-500">*</span>
          </label>
          <Tabs value={selectedTab} onValueChange={handleOnTabChange}>
            <TabsList>
              <TabsTrigger value="dropdown">Select Icon</TabsTrigger>
              <TabsTrigger value="uploader">Upload Icon</TabsTrigger>
            </TabsList>

            <TabsContent value="uploader">
              <IconUploader fieldPath={field.name} maxSize={2 * 1024 * 1024} />
            </TabsContent>

            <TabsContent value="dropdown">
              <IconSelect field={field} />
            </TabsContent>
          </Tabs>

          <FormMessage />

          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Tab Switch</AlertDialogTitle>
                <AlertDialogDescription>
                  Switching will reset the selected icon. Do you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={cancelTabChange}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmTabChange}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </FormItem>
      )}
    />
  );
};

export default ProductIconField;
