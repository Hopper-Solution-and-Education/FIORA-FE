'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateAccountModal } from './components/CreateAccountPage';
import { useState } from 'react';

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <main>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Create or view account details</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() =>
              setIsCreateModalOpen(() => {
                return true;
              })
            }
            className="w-full"
          >
            Create New Account
          </Button>
        </CardContent>
      </Card>

      <CreateAccountModal isOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />
    </main>
  );
}
