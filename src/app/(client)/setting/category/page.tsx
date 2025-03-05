import dynamic from 'next/dynamic';
import React from 'react';

const CategoryPageRender = dynamic(() => import('@/features/setting/presentation/CategoryPage'), {
  loading: () => <div>Loading...</div>,
});

const Category = () => {
  return <CategoryPageRender />;
};

export default Category;
