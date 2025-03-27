import { Button } from '@/components/ui/button';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { ChangeEvent, useMemo, useState } from 'react';
import {
  MOCK_ACCOUNTS,
  MOCK_CATEORIES,
  MOCK_PRODUCTS,
  TransactionCurrency,
  TransactionRecurringType,
} from '../types/constants';
import { DropdownOption, Transaction as TransactionHistory } from '../types/types';
import { DateTimePicker } from '@/components/common/atoms/DateTimePicker';

type CreateTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateTransactionModal = ({ isOpen, onClose }: CreateTransactionModalProps) => {
  const [newObject, setNewObject] = useState<TransactionHistory>({
    date: new Date(),
    type: 'Expense',
  } as TransactionHistory);

  const [amountValue, setAmountValue] = useState<number | undefined>(1);
  const [amountCurrency, setAmountCurrency] = useState<TransactionCurrency>(
    TransactionCurrency.USD,
  );
  const [recurringType, setRecurringType] = useState<TransactionRecurringType>(
    TransactionRecurringType.NONE,
  );
  const [recurringDate, setRecurringDate] = useState<unknown>();

  const handleFieldChange = (field: keyof TransactionHistory, value: any) => {
    if (field === 'type' && newObject.type !== value) {
      setNewObject((prev) => ({
        ...prev,
        [field]: value,
        fromAccount: undefined,
        fromCategory: undefined,
        toAccount: undefined,
        toCategory: undefined,
      }));
    } else {
      setNewObject((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < 0) return;
    if (Number(e.target.value) === 0) return setAmountValue(undefined);
    setAmountValue(Number(e.target.value));
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
        <div className="w-full h-fit max-h-[70vh] overflow-y-scroll flex flex-col justify-start items-start gap-4 pr-5 pl-3 py-[2vh]">
          {/* Date Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Date <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              modal={false}
              value={newObject.date}
              onChange={(date) => handleFieldChange('date', date)}
              clearable
              hideTime // Chỉ hiển thị ngày
            />
          </div>

          {/* Type Select */}
          <div className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
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
          <div className="w-full flex flex-col justify-start items-end">
            <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
              <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                // disabled={isRegistering} // Disable during register period
                value={amountValue}
                min={0}
                placeholder="0"
                onChange={handleAmountChange}
                required
                className={cn('w-full')}
              />
            </div>
            <div className="w-[80%] flex flex-col justify-between items-start">
              {/* Increate button group */}
              {amountValue && amountValue > 0 && (
                <div className="w-full h-11 flex justify-evenly items-center gap-2 py-2">
                  <Button
                    variant={'secondary'}
                    className="w-full h-full"
                    onClick={() => setAmountValue(amountValue * 10)}
                  >
                    {amountValue * 10}
                  </Button>
                  <Button
                    variant={'secondary'}
                    className="w-full h-full"
                    onClick={() => setAmountValue(amountValue * 100)}
                  >
                    {amountValue * 100}
                  </Button>
                  <Button
                    variant={'secondary'}
                    className="w-full h-full"
                    onClick={() => setAmountValue(amountValue * 10000)}
                  >
                    {amountValue * 1000}
                  </Button>
                  <Button
                    variant={'secondary'}
                    className="w-full h-full"
                    onClick={() => setAmountValue(amountValue * 100000)}
                  >
                    {amountValue * 10000}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Currency Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Currency <span className="text-red-500">*</span>
            </Label>
            <Select
              name="Select currency"
              value={amountCurrency}
              required
              onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select currency" />
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
            {newObject.type === 'Income' ? (
              <Select
                name="Select Category"
                value={newObject.fromCategory ?? ''}
                required
                onValueChange={(value) => handleFieldChange('fromCategory', value)}
              >
                <SelectTrigger className="w-full px-4 py-3">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                  {MOCK_CATEORIES.map((option: DropdownOption, index: number) => (
                    <SelectItem key={index} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select
                name="Select Account"
                value={newObject.fromAccount ?? ''}
                required
                onValueChange={(value) => handleFieldChange('fromAccount', value)}
              >
                <SelectTrigger className="w-full px-4 py-3">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                  {MOCK_ACCOUNTS.map((option: DropdownOption, index: number) => (
                    <SelectItem key={index} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* To Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              To <span className="text-red-500">*</span>
            </Label>
            {newObject.type === 'Expense' ? (
              <Select
                name="Select Category"
                value={newObject.toCategory ?? ''}
                required
                onValueChange={(value) => handleFieldChange('toCategory', value)}
              >
                <SelectTrigger className="w-full px-4 py-3">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                  {MOCK_CATEORIES.map((option: DropdownOption, index: number) => (
                    <SelectItem key={index} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select
                name="Select Account"
                value={newObject.toAccount ?? ''}
                required
                onValueChange={(value) => handleFieldChange('toAccount', value)}
              >
                <SelectTrigger className="w-full px-4 py-3">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                  {MOCK_ACCOUNTS.map((option: DropdownOption, index: number) => (
                    <SelectItem key={index} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Products Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Products
            </Label>
            <Select
              name="Select products"
              value={productsText}
              onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
            >
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Select products" />
              </SelectTrigger>
              <SelectContent className="w-full max-h-[20vh] overflow-y-scroll no-scrollbar">
                {MOCK_PRODUCTS.map((option: DropdownOption, index: number) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
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
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
            <Label className="w-[20%] text-right text-sm text-gray-700 dark:text-gray-300">
              Recurring
            </Label>
            <Select
              name="Type"
              value={recurringType}
              onValueChange={(value) => setRecurringType(value as TransactionRecurringType)}
            >
              <SelectTrigger className="w-[30%] px-4 py-3">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TransactionRecurringType).map((values: string) => (
                  <SelectItem key={values} value={values}>
                    {values}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="w-[10%] text-right text-sm text-gray-700 dark:text-gray-300">
              At
            </Label>
            <DateTimePicker
              modal={false}
              value={recurringDate as Date}
              onChange={(date) => setRecurringDate(date)}
              clearable
              hideTime // Chỉ hiển thị ngày
            />
          </div>

          {/* Recurring Action Select */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <Label className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              Copy and
            </Label>
            <RadioGroup defaultValue="do-nothing" className="w-full flex gap-10">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="do-nothing" id="do-nothing" />
                <Label htmlFor="do-nothing">Do nothing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copy" id="copy" />
                <Label htmlFor="copy">Copy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">New</Label>
              </div>
            </RadioGroup>
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
