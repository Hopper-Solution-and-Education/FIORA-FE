'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-left"
      richColors
      duration={3000}
      gap={10}
      visibleToasts={2.5}
      dir="ltr"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            'sonner-toast bg-white dark:bg-[hsl(var(--card))] text-[hsl(var(--foreground))] font-medium text-sm py-3 px-4',
          success:
            'sonner-toast-success bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          error:
            'sonner-toast-error bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          warning:
            'sonner-toast-warning bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          info: 'sonner-toast-info bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          loading:
            'sonner-toast-loading bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        },
      }}
      data-testid="toast-container"
      {...props}
    />
  );
};

export { Toaster };
