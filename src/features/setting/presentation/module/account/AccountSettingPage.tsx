'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateAccountModal } from './components/CreateAccountPage';
import { useState } from 'react';
import { AccountCreate } from '../../types';

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [errRes, setErrRes] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // const sampleAccount = {
  //   icon: '',
  //   type: 'Credit Card',
  //   name: 'Citibank Platinum Cashback',
  //   currency: '($) USD',
  //   limit: '10,000.00',
  //   balance: '-4,000.00',
  //   parent: 'My Credit Card Account',
  // };

  const handleCreateSubmit = async (dataCreate: AccountCreate) => {
    // create a function submit to create new account
    try {
      const createdRes = await fetch('/api/accounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataCreate),
      });

      const data = await createdRes.json();

      if (!createdRes.ok) {
        setErrRes(data.message || 'Something went wrong');
        // handle success
      }
      setIsCreateModalOpen(false);
      setSuccessMessage('Account created successfully');
    } catch (error: any) {
      setErrRes(error.message || 'Failed to create account');
    }
  };

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
                setErrRes('');
                setSuccessMessage(null);
                return true;
              })
            }
            className="w-full"
          >
            Create New Account
          </Button>
          <Button variant="outline" onClick={() => setIsViewModalOpen(true)} className="w-full">
            View Account Details
          </Button>
        </CardContent>
      </Card>

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        errRes={errRes}
        successMessage={successMessage}
      />

      {/* <ViewAccountModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        accountData={sampleAccount}
        onDelete={handleDelete}
      /> */}
    </main>
  );
}
