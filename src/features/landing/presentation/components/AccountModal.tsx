'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AccountType = 'Payment' | 'Saving' | 'CreditCard' | 'Debt' | 'Lending';
type Currency = 'VND' | 'USD';

type AccountSettingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
};

export default function AccountSettingModal({ isOpen, onClose }: AccountSettingModalProps) {
  const [accountType, setAccountType] = useState<AccountType>('Payment');
  const [balance, setBalance] = useState<string>('');
  const [creditLimit, setCreditLimit] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('VND'); // Mặc định VND
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const accountTypes: AccountType[] = ['Payment', 'Saving', 'CreditCard', 'Debt', 'Lending'];
  const currencies: Currency[] = ['VND', 'USD'];

  const validateBalance = (type: AccountType, balanceValue: number, creditLimitValue?: number) => {
    switch (type) {
      case 'Payment':
      case 'Saving':
      case 'Lending':
        if (balanceValue < 0) return 'Balance must be greater than or equal to 0';
        break;
      case 'CreditCard':
        if (balanceValue > 0) return 'Balance must be less than or equal to 0';
        if (creditLimitValue && balanceValue < -creditLimitValue)
          return `Balance cannot be lower than -${creditLimitValue} (Credit Limit)`;
        break;
      case 'Debt':
        if (balanceValue > 0) return 'Balance must be less than or equal to 0';
        break;
    }
    return null;
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBalance(value);
    const numValue = value === '' ? 0 : Number(value);
    const creditLimitNum = creditLimit === '' ? 0 : Number(creditLimit);
    const validationError = validateBalance(accountType, numValue, creditLimitNum);
    setError(validationError);
  };

  const handleCreditLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCreditLimit(value);
    const numValue = balance === '' ? 0 : Number(balance);
    const creditLimitNum = value === '' ? 0 : Number(value);
    const validationError = validateBalance(accountType, numValue, creditLimitNum);
    setError(validationError);
  };

  const handleSave = async () => {
    const numBalance = balance === '' ? 0 : Number(balance);
    const numCreditLimit = creditLimit === '' ? 0 : Number(creditLimit);

    const validationError = validateBalance(accountType, numBalance, numCreditLimit);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!name) {
      setError('Account name is required');
      return;
    }

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          name,
          type: accountType,
          balance: numBalance,
          limit: accountType === 'CreditCard' ? numCreditLimit : 0,
          currency, // Gửi currency được chọn
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const newAccount = await response.json();
      console.log('Account created:', newAccount);
      onClose();
      router.refresh();
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Row 1: Account Type */}
          <div className="text-center">
            <Label className="text-lg font-medium">Account Type</Label>
            <p className="text-2xl font-bold">{accountType}</p>
          </div>

          {/* Row 2: Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter account name"
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="balance">Nhap balance</Label>
              <Input
                id="balance"
                type="number"
                value={balance}
                onChange={handleBalanceChange}
                placeholder="Enter balance (default: 0)"
                className={error ? 'border-red-500' : ''}
              />
            </div>
            {accountType === 'CreditCard' && (
              <div>
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  value={creditLimit}
                  onChange={handleCreditLimitChange}
                  placeholder="Enter credit limit"
                  className={error ? 'border-red-500' : ''}
                />
              </div>
            )}
            <div>
              <Label>Currency</Label>
              <div className="flex justify-center gap-2">
                {currencies.map((curr) => (
                  <Button
                    key={curr}
                    variant={currency === curr ? 'default' : 'outline'}
                    onClick={() => setCurrency(curr)}
                    className="w-20"
                  >
                    {curr}
                  </Button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* Row 3: Selection Boxes & Buttons */}
          <div className="space-y-4">
            <Label>Choosing Type</Label>
            <div className="flex justify-center gap-2 flex-wrap">
              {accountTypes.map((type) => (
                <Button
                  key={type}
                  variant={accountType === type ? 'default' : 'outline'}
                  onClick={() => {
                    setAccountType(type);
                    setBalance('');
                    setCreditLimit('');
                    setError(null);
                  }}
                  className="w-24 text-sm"
                >
                  {type}
                </Button>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <DialogClose asChild>
                <Button variant="outline" className="px-6">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleSave} className="px-6">
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
