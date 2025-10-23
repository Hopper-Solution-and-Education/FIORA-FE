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
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { toast } from 'sonner';

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

const isImageUrl = (url?: string) => !!url && /^https?:\/\/.*\.(png|jpg|jpeg|gif|svg)$/.test(url);

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

  const fetchReceivers = useCallback(async (q: string) => {
    if (!q.trim()) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/sending-wallet/recommend-reciever?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok || json.status !== 200)
        throw new Error(json.message || 'Failed to fetch receivers');
      const data: Receiver[] = json.data || [];
      const opts: ReceiverOptionType[] = data.map((r) => ({
        value: r.email,
        label: r.name || r.email,
        icon: r.image || undefined,
      }));
      setOptions(opts);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (search) {
      const timeout = setTimeout(() => {
        fetchReceivers(search);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setOptions([]);
    }
  }, [search, fetchReceivers]);

  // Update displayLabel nếu value thay đổi từ parent
  useEffect(() => {
    if (value) {
      // Lấy luôn email của người được chọn
      setDisplayLabel(value);
    } else {
      setDisplayLabel('');
    }
  }, [value]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const renderIconOrImage = (icon?: string) => {
    if (!icon) return null;
    if (isImageUrl(icon)) {
      return (
        <div className="w-5 h-5 rounded-full overflow-hidden">
          <Image src={icon} alt="avatar" width={20} height={20} className="object-cover" />
        </div>
      );
    }
    return <Icons.user className="w-4 h-4" />;
  };

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
              {displayLabel &&
                renderIconOrImage(options.find((o) => o.label === displayLabel)?.icon)}
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
                        onChange(opt.value); // cập nhật parent
                        setDisplayLabel(opt.value); // hiển thị email
                        setSearch(''); // reset input
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {renderIconOrImage(opt.icon)}
                        <span>
                          {opt.label} ({opt.value})
                        </span>{' '}
                        {/* tên + email trong dropdown */}
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
