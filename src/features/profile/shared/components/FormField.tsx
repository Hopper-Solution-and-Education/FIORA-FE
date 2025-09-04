'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  type = 'text',
  required = false,
  tooltip,
  disabled = false,
  className = 'h-11',
  onChange,
  children,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children ? (
        children
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={className}
        />
      )}
    </div>
  );
};

export default FormField;
