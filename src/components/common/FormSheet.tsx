'use client';

import type React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
  required?: boolean;
  section?: string;
  render?: (field: any) => React.ReactNode;
}

interface FormSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormFieldProps[];
  form: any; // Form from react-hook-form
  onSubmit: (data: any) => void;
  submitText?: string;
  cancelText?: string;
  className?: string;
  loading?: boolean;
}

export const FormSheet = ({
  isOpen,
  setIsOpen,
  title,
  description,
  fields,
  form,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  className,
  loading = false,
}: FormSheetProps) => {
  // Group fields by section if provided
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className={cn(
          'w-full sm:max-w-md md:max-w-lg lg:max-w-xl max-h-screen overflow-y-auto bg-card text-card-foreground p-0',
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex justify-between items-center">
              <div>
                <SheetTitle className="text-xl font-semibold text-foreground">{title}</SheetTitle>
                {description && (
                  <SheetDescription className="text-sm text-muted-foreground mt-1">
                    {description}
                  </SheetDescription>
                )}
              </div>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Form {...form}>
              <form id="form-sheet" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {sectionKeys.map((sectionKey, index) => (
                  <div key={sectionKey} className="space-y-6">
                    {sectionKey !== 'default' && (
                      <>
                        <h3 className="text-lg font-medium text-foreground">{sectionKey}</h3>
                        <Separator className="my-2" />
                      </>
                    )}
                    <div className="space-y-6">
                      {sections[sectionKey].map((field) => (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: formField }) => (
                            <FormItem className="space-y-3">
                              <div className="flex items-baseline justify-between">
                                <FormLabel className="text-sm font-medium text-foreground">
                                  {field.label}
                                  {field.required && (
                                    <span className="text-destructive ml-1">*</span>
                                  )}
                                </FormLabel>
                                {field.description && (
                                  <FormDescription className="text-xs text-muted-foreground">
                                    {field.description}
                                  </FormDescription>
                                )}
                              </div>
                              <FormControl>
                                {field.render ? (
                                  field.render(formField)
                                ) : field.type === 'textarea' ? (
                                  <Textarea
                                    {...formField}
                                    placeholder={field.placeholder}
                                    className="w-full bg-background text-foreground border-input resize-none min-h-[120px]"
                                  />
                                ) : (
                                  <Input
                                    {...formField}
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    className="w-full bg-background text-foreground border-input h-10"
                                  />
                                )}
                              </FormControl>
                              <FormMessage className="text-xs text-destructive" />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    {index < sectionKeys.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </form>
            </Form>
          </div>

          <SheetFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-card z-10">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
              >
                {cancelText}
              </Button>
              <Button
                type="submit"
                form="form-sheet"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
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
