'use client';
import SelectField from '@/components/common/forms/select/SelectField';
import { httpClient } from '@/config'; // ✅ import đúng
import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  image?: string | null;
}

interface CatalogResponse {
  data: {
    products: Product[];
    categories?: any[];
  };
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
  side,
  name,
  value = '',
  onChange = () => {},
  usePortal = false,
  ...props
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await httpClient.get<CatalogResponse>('/api/sending-wallet/catalog');
        if (res?.data?.products) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCatalog();
  }, []);

  const options = Array.isArray(products)
    ? products
        .filter((p): p is Product => !!p && !!p.id && !!p.name) // loại bỏ phần tử null/undefined
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
