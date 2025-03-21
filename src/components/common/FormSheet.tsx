// components/common/FormSheet.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Thêm Select
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/shared/types/formsheet.type';
import { LoaderCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FormSheetProps<T> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormFieldProps[];
  form: any;
  onSubmit: (data: T) => void;
  submitText?: string;
  cancelText?: string;
  context?: any;
  loading?: boolean;
  className?: string;
}

export const FormSheet = <T,>({
  isOpen,
  setIsOpen,
  title,
  description,
  fields,
  form,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  context,
  loading = false,
  className,
}: FormSheetProps<T>) => {
  const [mounted, setMounted] = useState(false);

  const sections = fields.reduce(
    (acc, field) => {
      const section = field.section || 'default';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(field);
      return acc;
    },
    {} as Record<string, FormFieldProps[]>,
  );

  const sectionKeys = Object.keys(sections);

  useEffect(() => {
    setMounted(isOpen);
    if (!isOpen) {
      form.clearErrors();
    }
  }, [isOpen, form]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className={cn(
          'w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-0 bg-card text-card-foreground border-l border-border shadow-lg',
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex justify-between items-center">
              <div>
                <SheetTitle className="text-xl font-semibold text-foreground">{title}</SheetTitle>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-md">{description}</p>
                )}
              </div>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div
            className={cn(
              'flex-1 overflow-y-auto px-6 py-6 transition-opacity duration-300',
              mounted ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Form {...form}>
              <form id="form-sheet" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {sectionKeys.map((sectionKey, index) => (
                  <div key={sectionKey} className="space-y-5">
                    {sectionKey !== 'default' && (
                      <>
                        <h3 className="text-base font-medium text-foreground">{sectionKey}</h3>
                        <Separator className="my-2" />
                      </>
                    )}
                    <div className="space-y-5">
                      {sections[sectionKey].map((field) => (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem
                              className={cn(
                                'flex flex-col space-y-2',
                                'group rounded-lg p-3 hover:bg-muted/40 transition-colors',
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <FormLabel className="text-sm font-medium text-foreground">
                                  {field.label}
                                  {field.required && (
                                    <span className="text-destructive ml-1">*</span>
                                  )}
                                </FormLabel>
                                {field.description && (
                                  <FormDescription className="text-xs text-muted-foreground hidden group-hover:block">
                                    {field.description}
                                  </FormDescription>
                                )}
                              </div>
                              <div className="w-full">
                                <FormControl>
                                  {field.render ? (
                                    field.render(formField, context)
                                  ) : field.type === 'textarea' ? (
                                    <Textarea
                                      {...formField}
                                      placeholder={field.placeholder}
                                      className="w-full bg-background text-foreground border-input resize-none min-h-[100px] focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                    />
                                  ) : field.type === 'select' ? (
                                    <Select
                                      value={formField.value}
                                      onValueChange={formField.onChange}
                                    >
                                      <SelectTrigger className="w-full bg-background text-foreground border-input">
                                        <SelectValue
                                          placeholder={field.placeholder || 'Select an option'}
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {field.options?.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      {...formField}
                                      type={field.type || 'text'}
                                      placeholder={field.placeholder}
                                      className="w-full bg-background text-foreground border-input focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                    />
                                  )}
                                </FormControl>
                              </div>
                              <FormMessage className="text-xs text-destructive dark:text-red-500 font-medium opacity-90 transition-opacity duration-200" />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    {index < sectionKeys.length - 1 && <Separator className="my-6" />}
                  </div>
                ))}
              </form>
            </Form>
          </div>

          <SheetFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-card z-10 flex-shrink-0">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {cancelText}
              </Button>
              <Button
                type="submit"
                form="form-sheet"
                disabled={loading || !form.formState.isValid}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin h-4 w-4 mr-2" /> Processing...
                  </>
                ) : (
                  submitText
                )}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FormSheet;
