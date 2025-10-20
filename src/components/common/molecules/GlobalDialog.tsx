'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DialogIconInfo from '@public/icons/dialog-icon-info.svg';
import clsx from 'clsx';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';
import { CommonTooltip } from '../atoms/CommonTooltip';

type DialogVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';

type GlobalDialogProps = {
  // DIALOG PROPS
  open: boolean;
  type?: 'default' | 'info' | 'success' | 'warning' | 'danger';
  onOpenChange: (open: boolean) => void;
  variant?: DialogVariant;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;

  // CONTENT PROPS
  title?: string;
  heading?: string;
  description?: string | ReactNode;
  renderContent?: () => ReactNode;

  // FOOTER PROPS
  showFooter?: boolean;
  footer?: ReactNode;
  confirmText?: string;
  iconConfirm?: ReactNode;
  onConfirm?: () => void;
  hideConfirm?: boolean;
  cancelText?: string;
  iconCancel?: ReactNode;
  onCancel?: () => void;
  hideCancel?: boolean;
  customRightButton?: ReactNode;
  customLeftButton?: ReactNode;
};

const VARIANT_BORDER_MAP: Record<DialogVariant, string> = {
  default: 'border border-muted',
  info: 'border border-blue-200',
  success: 'border border-green-200',
  warning: 'border border-yellow-200',
  danger: 'border border-red-200',
};

const VARIANT_BUTTON_BG_MAP: Record<DialogVariant, string> = {
  default:
    'w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200',
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
  // DIALOG PROPS
  open,
  type = 'default',
  onOpenChange,
  variant = 'default',
  className = '',
  children,
  disabled = false,
  isLoading = false,

  // CONTENT PROPS
  title,
  heading,
  description,
  renderContent,

  // FOOTER PROPS
  showFooter = true,
  footer,
  confirmText = 'Confirm',
  iconConfirm = <Icons.check className="h-5 w-5" />,
  onConfirm,
  hideConfirm = false,
  cancelText = 'Cancel and go back',
  iconCancel = <Icons.circleArrowLeft className="h-5 w-5" />,
  onCancel,
  hideCancel = false,
  customLeftButton,
  customRightButton,
}: GlobalDialogProps) => {
  const Icon = () => {
    switch (type) {
      case 'info':
        return <Image src={DialogIconInfo} alt="logo" width={60} height={60} />;
      case 'success':
        return null;
      case 'warning':
        return null;
      case 'danger':
        return (
          <div className="rounded-full bg-red-50 p-4 mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const _renderFooter = () => {
    if (footer) return footer;
    return (
      <div className="w-full mt-auto shrink-0">
        <div className="flex justify-between">
          {/* Left Button */}
          {customLeftButton ? (
            customLeftButton
          ) : !hideCancel ? (
            <CommonTooltip content={cancelText}>
              <Button
                disabled={disabled || isLoading}
                variant="outline"
                type="button"
                onClick={() => (onCancel ? onCancel() : onOpenChange(false))}
                className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
                data-test="form-cancel-button"
              >
                {iconCancel}
              </Button>
            </CommonTooltip>
          ) : (
            <div />
          )}

          {/* Right Button */}
          {customRightButton ? (
            customRightButton
          ) : !hideConfirm ? (
            <CommonTooltip content={confirmText}>
              <Button
                disabled={disabled || isLoading}
                type="button"
                onClick={() => (onConfirm ? onConfirm() : onOpenChange(false))}
                variant={VARIANT_BUTTON_MAP[variant]}
                className={clsx(VARIANT_BUTTON_BG_MAP[variant])}
              >
                {isLoading ? <Icons.spinner className="animate-spin h-5 w-5" /> : iconConfirm}
              </Button>
            </CommonTooltip>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isLoading ? (isLoading ? undefined : onOpenChange) : onOpenChange}
    >
      <DialogContent
        className={clsx(
          'sm:max-w-lg flex flex-col max-h-[90vh]',
          VARIANT_BORDER_MAP[variant],
          className,
        )}
      >
        <DialogHeader className="flex items-center shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div className="w-16">
                <Icon />
              </div>
            </div>
            {title && <DialogTitle className="text-xl font-bold mb-3">{title}</DialogTitle>}
            <div className="text-center flex flex-col gap-2">
              {heading && <DialogTitle className="font-normal text-md">{heading}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 px-4">
          {renderContent ? renderContent() : <div>{children}</div>}
        </div>

        {showFooter && _renderFooter()}
      </DialogContent>
    </Dialog>
  );
};
