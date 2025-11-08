'use client';
import SelectField from '@/components/common/forms/select/SelectField';
import React from 'react';

interface Product {
  id: string;
  name: string;
  image?: string | null;
}

interface ProductSelectProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  usePortal?: boolean;
  [key: string]: any;
}

const ProductSelectField: React.FC<ProductSelectProps> = ({
  products,
  side,
  name,
  value = '',
  onChange = () => {},
  usePortal = false,
  ...props
}) => {
  const options = Array.isArray(products)
    ? products
        .filter((p): p is Product => !!p && !!p.id && !!p.name)
        .map((p) => ({
          value: p.id,
          label: p.name,
          icon: p.image ?? undefined,
        }))
    : [];

  return (
    <SelectField
      side={side}
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select a product..."
      usePortal={usePortal}
      {...props}
    />
  );
};

export default ProductSelectField;
