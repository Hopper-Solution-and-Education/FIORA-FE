'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { httpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { debounce } from 'lodash';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { toast } from 'sonner';

// ======================== Types ========================
interface Receiver {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

interface ReceiverOptionType {
  value: string;
  label: string;
  icon?: string;
}

interface ReceiverSelectFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  placeholder?: string;
  className?: string;
}

// ======================== Helper ========================
const isImageUrl = (url?: string) =>
  !!url && /^https?:\/\/.*\.(png|jpg|jpeg|gif|svg|webp)$/.test(url);

// ======================== Component ========================
const ReceiverSelectField: React.FC<ReceiverSelectFieldProps> = ({
  value,
  onChange = () => {},
  error,
  placeholder = 'Search receiver by email...',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<ReceiverOptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayLabel, setDisplayLabel] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // ======================== Fetch receivers ========================
  const fetchReceivers = useCallback(async (q: string) => {
    if (!q.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const url = routeConfig(ApiEndpointEnum.SendingWalletRecommendReceiver, undefined, {
        q: q.trim(),
      });

      const json = await httpClient.get<{
        status: number;
        message?: string;
        data?: Receiver[];
      }>(url);

      if (!json || json.status !== 200) {
        throw new Error(json?.message || 'Failed to fetch receivers');
      }

      const receivers = json.data ?? [];
      const opts: ReceiverOptionType[] = receivers
        .filter((r) => r?.email && r?.id)
        .map((r) => ({
          value: r.email,
          label: r.name || r.email,
          icon: r.image || undefined,
        }));

      setOptions(opts);
    } catch (e: any) {
      toast.error(e?.message || 'Unable to load receivers');
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================== Debounce search ========================
  useEffect(() => {
    if (!search.trim()) {
      setOptions([]);
      return;
    }

    const debouncedFetch = debounce((query: string) => {
      fetchReceivers(query);
    }, 350);

    debouncedFetch(search);

    // Cleanup: cancel debounce on unmount or search change
    return () => {
      debouncedFetch.cancel();
    };
  }, [search, fetchReceivers]);

  // ======================== Sync label with selected value ========================
  useEffect(() => {
    if (value) {
      setDisplayLabel(value);
    }
  }, [value]);

  // ======================== Auto focus input when open ========================
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // ======================== Render icon or fallback ========================
  const renderIconOrImage = (icon?: string) => {
    if (!icon) return <Icons.user className="w-4 h-4 text-muted-foreground" />;
    if (isImageUrl(icon)) {
      return (
        <div className="w-5 h-5 rounded-full overflow-hidden">
          <Image src={icon} alt="avatar" width={20} height={20} className="object-cover" />
        </div>
      );
    }
    return <Icons.user className="w-4 h-4 text-muted-foreground" />;
  };

  // ======================== Render ========================
  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${error ? 'border-red-500' : ''}`}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="flex items-center gap-2">
              {displayLabel
                ? renderIconOrImage(options.find((o) => o.value === value)?.icon)
                : null}
              {displayLabel || placeholder}
            </span>
            <Icons.chevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[--radix-popover-trigger-width] z-[9999] overflow-visible">
          <Command>
            <CommandInput
              ref={inputRef}
              placeholder="Search by email..."
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandList className="max-h-[240px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Icons.spinner className="animate-spin w-4 h-4 text-muted-foreground" />
                </div>
              ) : options.length === 0 ? (
                <CommandEmpty>No receiver found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => {
                        onChange(opt.value);
                        setDisplayLabel(opt.value);
                        setSearch('');
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {renderIconOrImage(opt.icon)}
                        <span>
                          {opt.label} ({opt.value})
                        </span>
                        {value === opt.value && <Icons.check className="ml-auto w-4 h-4" />}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default ReceiverSelectField;
