'use client';
import SelectField from '@/components/common/forms/select/SelectField';
import React, { useEffect, useState } from 'react';

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
  side,
  name,
  value = '',
  onChange = () => {},
  usePortal = false,
  ...props
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  // 🧭 Gọi API catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch('/api/sending-wallet/catalog');
        if (!res.ok) throw new Error('Failed to fetch catalog');
        const json = await res.json();

        // Giả định BE trả về dạng { data: { categories: [...], products: [...] } }
        if (json?.data?.products) {
          setProducts(json.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCatalog();
  }, []);

  // 🔁 Chuẩn hóa data thành options
  const options = products.map((p) => ({
    value: p.id,
    label: p.name,
    icon: p.image ?? undefined,
  }));

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
