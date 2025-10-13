'use client';
import SelectField from '@/components/common/forms/select/SelectField';
import { AccountSelectField } from '@/features/payment-wallet/slices/types';
import React, { useEffect, useState } from 'react';

interface ReceiverSelectProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  usePortal?: boolean;
  [key: string]: any;
}

const ReceiverSelectField: React.FC<ReceiverSelectProps> = ({
  side,
  name,
  value = '',
  onChange = () => {},
  usePortal = false,
  ...props
}) => {
  const [receivers, setReceivers] = useState<AccountSelectField[]>([]);
  const [search, setSearch] = useState('');

  // Gọi API gợi ý người nhận
  useEffect(() => {
    const fetchReceivers = async () => {
      if (!search.trim()) return; // nếu người dùng chưa nhập gì thì bỏ qua
      try {
        const res = await fetch(
          `/api/sending-wallet/recommend-reciever?q=${encodeURIComponent(search)}`,
        );
        if (!res.ok) throw new Error('Failed to fetch receivers');
        const json = await res.json();
        if (json?.data) {
          setReceivers(json.data);
        }
      } catch (error) {
        console.error('Error fetching receivers:', error);
      }
    };

    const debounce = setTimeout(fetchReceivers, 400); // debounce tránh spam API
    return () => clearTimeout(debounce);
  }, [search]);

  const options = receivers.map((r) => ({
    value: r.id,
    label: r.name || r.email,
    icon: r.image ?? undefined, // null -> undefined
  }));

  return (
    <SelectField
      side={side}
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Search or select receiver..."
      usePortal={usePortal}
      {...props}
    />
  );
};

export default ReceiverSelectField;
