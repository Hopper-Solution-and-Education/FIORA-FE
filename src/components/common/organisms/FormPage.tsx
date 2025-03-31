'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface FormPageProps<T> {
  title: string;
  FormComponent: React.ComponentType<{ initialData?: T }>;
  initialData?: T;
  headerActions?: ReactNode;
}

export default function FormPage<T>({
  title,
  FormComponent,
  initialData,
  headerActions,
}: FormPageProps<T>) {
  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </CardTitle>
            {headerActions}
          </CardHeader>
          <CardContent>
            <FormComponent initialData={initialData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
