'use client';

import * as FaqPageModule from '@/features/faq/presentation/EditFaqPage';

console.log('FaqPageModule:', FaqPageModule);

const EditFaqPage = FaqPageModule.default;

export default function FaqEditRoute() {
  return <EditFaqPage />;
}
