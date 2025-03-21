import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker-v1';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { useMemo, useState } from 'react';
import { DropdownOption, Transaction as TransactionHistory } from '../types/types';
import { TransactionCurrency, TransactionRecurringType } from '../types/constants';

const _mockAccountData: DropdownOption[] = [
  { label: 'Account A', value: '1' },
  { label: 'Account B', value: '2' },
  { label: 'Account C', value: '3' },
  { label: 'Account D', value: '4' },
  { label: 'Account E', value: '5' },
  { label: 'Account F', value: '6' },
  { label: 'Account G', value: '7' },
  { label: 'Account H', value: '8' },
  { label: 'Account I', value: '9' },
  { label: 'Account J', value: '10' },
  { label: 'Account K', value: '11' },
];

const _mockCategories: DropdownOption[] = [
  { label: 'Category A', value: '1' },
  { label: 'Category B', value: '2' },
  { label: 'Category C', value: '3' },
  { label: 'Category D', value: '4' },
  { label: 'Category E', value: '5' },
  { label: 'Category F', value: '6' },
  { label: 'Category G', value: '7' },
  { label: 'Category H', value: '8' },
  { label: 'Category I', value: '9' },
  { label: 'Category J', value: '10' },
  { label: 'Category K', value: '11' },
];

const _mockProducts: DropdownOption[] = [
  { label: 'Product A', value: '1' },
  { label: 'Product B', value: '2' },
  { label: 'Product C', value: '3' },
  { label: 'Product D', value: '4' },
  { label: 'Product E', value: '5' },
  { label: 'Product F', value: '6' },
  { label: 'Product G', value: '7' },
  { label: 'Product H', value: '8' },
  { label: 'Product I', value: '9' },
  { label: 'Product J', value: '10' },
  { label: 'Product K', value: '11' },
];

type CreateTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateTransactionModal = ({ isOpen, onClose }: CreateTransactionModalProps) => {
  const [newObject, setNewObject] = useState<TransactionHistory>({
    date: new Date(),
    type: 'Expense',
  } as TransactionHistory);

  const [amountCurrency, setAmountCurrency] = useState<TransactionCurrency>(
    TransactionCurrency.USD,
  );
  const [recurringType, setRecurringType] = useState<TransactionRecurringType>(
    TransactionRecurringType.NONE,
  );

  const handleFieldChange = (field: string, value: any) => {
    setNewObject((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTransaction = async () => {
    // Create transaction
  };

  const productsText = useMemo((): string | undefined => {
    return newObject.products ? newObject.products.join(', ') : undefined;
  }, [newObject.products]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          {/* <DialogDescription>Please read the terms and conditions carefully.</DialogDescription> */}
        </DialogHeader>

        {/* Dialog content */}
        <div className="w-full h-fit max-h-[70vh] overflow-y-scroll flex flex-col justify-center items-start gap-4 pr-5 pl-3 py-2">
          {/* Date Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Date <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              toDate={new Date()}
              value={newObject.date}
              required
              onChange={(date) => handleFieldChange('date', date)}
              className="w-full"
            />
          </div>

          {/* Type Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select
              name="Select type"
              value={newObject.type}
              required
              onValueChange={(value) => handleFieldChange('type', value)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {['Expense', 'Income', 'Transfer'].map((typeOption) => (
                  <SelectItem key={typeOption} value={typeOption.toString()}>
                    {typeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              // disabled={isRegistering} // Disable during register period
              value={newObject.amount}
              min={0}
              onChange={(e) => handleFieldChange('amount', e.target.value)}
              required
              className={cn('w-full')}
            />
          </div>

          {/* Currency Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Currency <span className="text-red-500">*</span>
            </Label>
            <Select
              name="Select type"
              value={amountCurrency}
              required
              onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TransactionCurrency).map((key: string) => (
                  <SelectItem key={key} value={key.toString()}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              From <span className="text-red-500">*</span>
            </Label>
            <Select
              name="Select from"
              value={newObject.fromAccount ?? newObject.fromCategory}
              required
              onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select from" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TransactionCurrency).map((key: string) => (
                  <SelectItem key={key} value={key.toString()}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              To <span className="text-red-500">*</span>
            </Label>
            <Select
              name="Select to"
              value={newObject.toAccount ?? newObject.toCategory}
              required
              onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select to" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TransactionCurrency).map((key: string) => (
                  <SelectItem key={key} value={key.toString()}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Products
            </Label>
            <Select
              name="Select products"
              value={productsText}
              required
              onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select products" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TransactionCurrency).map((key: string) => (
                  <SelectItem key={key} value={key.toString()}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Partner Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Partner
            </Label>
            <Select
              name="Select partner"
              value={newObject.partner}
              required
              onValueChange={(value) => handleFieldChange('partner', value)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select partner" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TransactionCurrency).map((key: string) => (
                  <SelectItem key={key} value={key.toString()}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="w-fit text-right text-sm text-gray-700 dark:text-gray-300">
              Recurring
            </Label>
            <Select
              name="Select partner"
              value={newObject.partner}
              required
              onValueChange={(value) => setRecurringType(value as TransactionRecurringType)}
            >
              <SelectTrigger className="w-fit px-4 py-3">
                <SelectValue placeholder="Select partner" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TransactionRecurringType).map((key: string) => (
                  <SelectItem key={key} value={key.toString()}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="w-fit text-right text-sm text-gray-700 dark:text-gray-300">At</Label>
            {recurringType}
          </div>
        </div>

        <DialogFooter className="w-full h-fit flex flex-row !justify-end items-center gap-5">
          <DialogClose onClick={onClose}>
            <Button className="bg-gray-300 hover:bg-gray-400 text-black min-w-fit">Cancel</Button>
          </DialogClose>

          <DialogTrigger onClick={handleCreateTransaction}>
            <Button className="bg-green-100 hover:bg-green-200 text-green-800  min-w-fit">
              Create
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal;
