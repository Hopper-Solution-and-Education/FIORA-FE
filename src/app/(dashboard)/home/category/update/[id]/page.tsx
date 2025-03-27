'use client';
import FormPage from '@/components/common/organisms/FormPage';
import UpdateCategoryForm from '@/features/home/module/category/components/UpdateCategoryForm';
import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/common/atoms/Loading';

export default function UpdateCategory({ params }: { params: { id: string } }) {
  const router = useRouter();
  const categories = useAppSelector((state) => state.category.categories.data);
  const category = categories?.find((cat) => cat.id === params.id);

  useEffect(() => {
    if (!category) {
      router.push('/home/category');
    }
  }, [category, router, params.id]);

  if (!category) return <Loading />;

  return (
    <FormPage
      title={`Edit Category: ${category.name}`}
      FormComponent={UpdateCategoryForm}
      initialData={category}
    />
  );
}
