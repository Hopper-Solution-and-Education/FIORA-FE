'use client';

import { cn } from '@/shared/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown, X } from 'lucide-react';
import * as React from 'react';

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    { options, selected, onChange, placeholder = 'Select options', className, disabled = false },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [visibleTags, setVisibleTags] = React.useState<string[]>([]);

    const handleSelect = (value: string) => {
      onChange(
        selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
      );
    };

    const handleRemoveOption = (e: React.MouseEvent, value: string) => {
      e.stopPropagation();
      onChange(selected.filter((item) => item !== value));
    };

    // Calculate visible tags and hidden count on selected change or window resize
    React.useEffect(() => {
      const calculateVisibleTags = () => {
        if (!containerRef.current || selected.length === 0) {
          setVisibleTags([]);
          return;
        }

        const container = containerRef.current;
        const containerWidth = container.clientWidth - 25; // Account for chevron icon

        let currentWidth = 0;
        const visibleItems: string[] = [];

        // Create a temporary div to measure tag widths
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.display = 'inline-flex';
        tempDiv.className = 'items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-xs';
        document.body.appendChild(tempDiv);

        for (let i = 0; i < selected.length; i++) {
          const value = selected[i];
          const option = options.find((opt) => opt.value === value);

          tempDiv.textContent = option?.label || value;
          const tagWidth = tempDiv.offsetWidth + 20; // Add padding and close icon width

          if (currentWidth + tagWidth > containerWidth && i > 0) {
            setVisibleTags(visibleItems);
            document.body.removeChild(tempDiv);
            return;
          }

          visibleItems.push(value);
          currentWidth += tagWidth + 4; // Add margin
        }

        setVisibleTags(visibleItems);
        document.body.removeChild(tempDiv);
      };

      calculateVisibleTags();
      window.addEventListener('resize', calculateVisibleTags);

      return () => {
        window.removeEventListener('resize', calculateVisibleTags);
      };
    }, [selected, options]);

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          ref={ref}
          className={cn(
            'flex min-h-5 w-full min-w-fit items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          disabled={disabled}
        >
          <div
            ref={containerRef}
            className="w-full flex flex-wrap gap-1 overflow-hidden items-center"
          >
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {visibleTags.length > 0 && (
                  <>
                    {(() => {
                      const option = options.find((opt) => opt.value === visibleTags[0]);
                      return (
                        <span
                          key={visibleTags[0]}
                          className="inline-flex items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-sm w-full max-w-[70%] justify-between overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="truncate">{option?.label || visibleTags[0]}</span>
                          <X
                            className="h-3 w-3 cursor-pointer flex-shrink-0"
                            onClick={(e) => handleRemoveOption(e, visibleTags[0])}
                          />
                        </span>
                      );
                    })()}
                    {selected.length > 1 && (
                      <span className="inline-flex items-center rounded-sm bg-primary px-1.5 py-0.5 text-xs text-primary-foreground font-medium opacity-70">
                        +{selected.length - 1}
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          className={cn(
            'relative z-50 max-h-96 min-w-[8rem] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'w-[var(--radix-popover-trigger-width)]',
            'max-h-[25vh] overflow-y-scroll no-scrollbar',
          )}
          align="start"
        >
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                  option.disabled && 'pointer-events-none opacity-50',
                  selected.includes(option.value) && 'bg-accent text-accent-foreground',
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                  {selected.includes(option.value) && <Check className="h-4 w-4" />}
                </span>
                {option.label}
              </div>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    );
  },
);
MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
