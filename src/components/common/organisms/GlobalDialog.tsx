'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { ReactNode } from 'react';

type DialogVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

type GlobalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  iconCancel?: ReactNode;
  iconConfirm?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideCancel?: boolean;
  hideConfirm?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  variant?: DialogVariant;
  customLeftButton?: ReactNode;
  customRightButton?: ReactNode;
};

const VARIANT_BORDER_MAP: Record<DialogVariant, string> = {
  default: 'border border-muted',
  info: 'border border-blue-200',
  success: 'border border-green-200',
  warning: 'border border-yellow-200',
  danger: 'border border-red-200',
};

const VARIANT_BUTTON_BG_MAP: Record<DialogVariant, string> = {
  default: '',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  success: 'bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  danger: 'bg-red-100 text-red-800 hover:bg-red-200',
};

const VARIANT_BUTTON_MAP: Record<DialogVariant, 'default' | 'destructive' | 'secondary' | 'ghost'> =
  {
    default: 'default',
    info: 'secondary',
    success: 'default',
    warning: 'secondary',
    danger: 'destructive',
  };

export const GlobalDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  iconCancel = <X />,
  iconConfirm = <Check />,
  onConfirm,
  onCancel,
  hideCancel = false,
  hideConfirm = false,
  children,
  footer,
  className = '',
  variant = 'default',
  customLeftButton,
  customRightButton,
}: GlobalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={clsx('sm:max-w-md flex flex-col', VARIANT_BORDER_MAP[variant], className)}
      >
        <DialogHeader className="flex gap-2 items-start">
          <div className="flex flex-col">
            {title && <DialogTitle className="text-xl font-bold">{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
        </DialogHeader>

        {children && <div className="mt-4">{children}</div>}

        {footer ? (
          footer
        ) : (
          <div className="w-full flex justify-between mt-auto pt-4">
            {/* Left Button */}
            {customLeftButton ? (
              customLeftButton
            ) : !hideCancel ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onCancel?.();
                  onOpenChange(false);
                }}
              >
                {iconCancel}
                <span className="ml-2">{cancelText}</span>
              </Button>
            ) : (
              <div />
            )}

            {/* Right Button */}
            {customRightButton ? (
              customRightButton
            ) : !hideConfirm ? (
              <Button
                type="button"
                onClick={() => {
                  onConfirm?.();
                  onOpenChange(false);
                }}
                variant={VARIANT_BUTTON_MAP[variant]}
                className={clsx(VARIANT_BUTTON_BG_MAP[variant])}
              >
                {iconConfirm}
                <span className="ml-2">{confirmText}</span>
              </Button>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
