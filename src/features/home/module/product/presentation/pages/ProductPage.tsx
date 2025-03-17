'use client';

import PageContainer from '@/components/layouts/PageContainer';
import { Separator } from '@/components/ui/separator';
import AddProductDialog from '../organisms/AddProductDialog';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { fetchCategories } from '../../slices';
import { Button } from '@/components/ui/button';

const ProductPage = () => {
  const { data: categories } = useAppSelector((state) => state.productManagement.categories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, pageSize: 10 }));
    console.log(categories);
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <DashboardHeading title="Products" description="Manage products" />
          <AddProductDialog />
        </div>
        <Button title="load" onClick={() => dispatch(fetchCategories({ page: 1, pageSize: 10 }))} />
        <Separator />
        <div>Product Page</div>
      </div>
    </PageContainer>
  );
};

export default ProductPage;
