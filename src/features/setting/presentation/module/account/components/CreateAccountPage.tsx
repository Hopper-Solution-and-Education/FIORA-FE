'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Account, CreateAccountModalProps } from '../../../settingSlices/expenseIncomeSlides/types';

import { ACCOUNT_ICONS, ACCOUNT_RULES, ACCOUNT_TYPES } from '../mockData';

export function CreateAccountModal({
  isOpen,
  setIsCreateModalOpen,
  setTriggered,
  isTriggered,
}: CreateAccountModalProps) {
  const [formData, setFormData] = useState({
    icon: '',
    type: ACCOUNT_TYPES.PAYMENT,
    name: '',
    currency: 'VND',
    limit: '',
    available_limit: '',
    balance: '',
    parent: '',
    isParentSelected: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableIcons, setAvailableIcons] = useState(ACCOUNT_ICONS);
  const [parentAccounts, setParentAccounts] = useState<Account[]>([]);
  const [errRes, setErrRes] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentTypeRules = ACCOUNT_RULES[formData.type];

  useEffect(() => {
    const filteredIcons = ACCOUNT_ICONS.filter((icon) => icon.types.includes(formData.type));
    setAvailableIcons(filteredIcons);

    if (formData.icon) {
      const iconStillValid = filteredIcons.some((icon) => icon.id === formData.icon);
      if (!iconStillValid) {
        setFormData((prev) => ({
          ...prev,
          icon: filteredIcons.length > 0 ? filteredIcons[0].id : '',
        }));
      }
    } else if (filteredIcons.length > 0) {
      setFormData((prev) => ({ ...prev, icon: filteredIcons[0].id }));
    }
  }, [formData.type, formData.icon]);

  const fetchParents = useCallback(async () => {
    try {
      const res = await fetch('/api/accounts/lists?isParent=true', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status !== 200) {
        setParentAccounts([]);
        return;
      }

      const data = await res.json();
      const accounts = data.data as Account[];

      if (Array.isArray(accounts)) {
        setParentAccounts(accounts);
      } else {
        console.error('Unexpected API response format');
        setParentAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching parent accounts:', error);
      setParentAccounts([]);
    }
  }, [isOpen]);

  const handleCreateSubmit = async (dataCreate: any) => {
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
      } else {
        setSuccessMessage('Account created successfully');
        setErrRes('');
        handleResetForm();

        setTimeout(() => {
          setIsCreateModalOpen(false);
          setSuccessMessage('');
          setTriggered(!isTriggered);
        }, 1000);
      }
    } catch (error: any) {
      setErrRes(error.message || 'Failed to create account');
    }
  };

  const handleResetForm = () => {
    setFormData({
      icon: '',
      type: ACCOUNT_TYPES.PAYMENT,
      name: '',
      currency: 'VND',
      limit: '',
      balance: '',
      parent: '',
      isParentSelected: false,
      available_limit: '',
    });
  };

  // Calculate available_limit for Credit Card in real-time
  useEffect(() => {
    if (formData.type === ACCOUNT_TYPES.CREDIT_CARD) {
      const limitValue = Number.parseFloat(formData.limit) || 0;
      const balanceValue = Number.parseFloat(formData.balance) || 0;
      const calculatedAvailableLimit = limitValue + balanceValue; // balance is negative
      if (calculatedAvailableLimit < 0) {
        // set error for available_limit
        setErrors((prev) => ({
          ...prev,
          available_limit: 'Balance cannot be lower than -Credit Limit',
        }));
      }
      setFormData((prev) => ({
        ...prev,
        available_limit: calculatedAvailableLimit.toFixed(2),
      }));

      // Clear any available_limit-related errors
      if (errors.available_limit) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.available_limit;
          return newErrors;
        });
      }
    }
  }, [formData.limit, formData.balance, formData.type]);

  useEffect(() => {
    fetchParents();
  }, [isTriggered, setTriggered]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    }

    if (!formData.icon) {
      newErrors.icon = 'Please select an icon';
    }

    // Balance validation based on account type
    if (formData.balance) {
      const balanceValue = Number.parseFloat(formData.balance);

      if (isNaN(balanceValue)) {
        newErrors.balance = 'Balance must be a valid number';
      } else {
        // Check min balance constraint
        if (currentTypeRules.minBalance !== null && balanceValue < currentTypeRules.minBalance) {
          newErrors.balance = `Balance must be greater than or equal to ${currentTypeRules.minBalance}`;
        }

        // Check max balance constraint
        if (currentTypeRules.maxBalance !== null && balanceValue > currentTypeRules.maxBalance) {
          newErrors.balance = `Balance must be less than or equal to ${currentTypeRules.maxBalance}`;
        }
      }
    }

    // Credit limit validation for Credit Card
    if (formData.type === ACCOUNT_TYPES.CREDIT_CARD) {
      if (formData.limit) {
        const limitValue = Number.parseFloat(formData.limit);

        if (isNaN(limitValue)) {
          newErrors.limit = 'Credit limit must be a valid number';
        } else if (limitValue <= 0) {
          newErrors.limit = 'Credit limit must be greater than 0';
        }

        // Check if balance exceeds credit limit
        if (formData.balance && !newErrors.balance) {
          const balanceValue = Number.parseFloat(formData.balance);
          if (balanceValue < -limitValue) {
            newErrors.balance = `Balance cannot be lower than -${formData.limit} (credit limit)`;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    // For parent field, use the special handler
    if (field === 'parent') {
      handleParentChange(value);
      return;
    }

    // For type field, use the special handler
    if (field === 'type') {
      handleTypeChange(value);
      return;
    }

    // Automatically convert balance to negative if type is Dept and Credit Card
    if (field === 'balance') {
      handleBalanceChange(value);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBalanceChange = (value: string) => {
    // Automatically convert balance to negative if type is Dept and Credit Card
    if ([ACCOUNT_TYPES.DEBT, ACCOUNT_TYPES.CREDIT_CARD].includes(formData.type)) {
      setFormData((prev) => ({ ...prev, balance: value.startsWith('-') ? value : `-${value}` }));
    } else {
      setFormData((prev) => ({ ...prev, balance: value }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // If balance is empty, set it to 0
      const finalData = {
        ...formData,
        balance: formData.balance || 0,
        limit: formData.limit || 0,
        parentId: formData.parent || null,
      };
      handleCreateSubmit(finalData);
    }
  };

  const handleParentChange = (parentId: string) => {
    if (!parentId) {
      setFormData((prev) => ({ ...prev, parent: '', isParentSelected: false }));
      return;
    }

    // Find the selected parent account
    const selectedParent = parentAccounts.find((p) => p.id === parentId);
    if (selectedParent) {
      // Update the parent and type in the form data
      setFormData((prev) => ({
        ...prev,
        parent: parentId,
        parentId: parentId,
        type: selectedParent.type, // Set the type to match the parent's type
        isParentSelected: true,
      }));
    } else {
      // Just update the parent if no matching parent found
      setFormData((prev) => ({
        ...prev,
        parent: parentId,
        isParentSelected: true,
      }));
    }

    // Clear any parent-related errors
    if (errors.parent) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.parent;
        return newErrors;
      });
    }
  };

  // Handle type change
  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      type,
      parent: '', // Reset parent when type changes
    }));

    // Clear any type-related errors
    if (errors.type) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.type;
        return newErrors;
      });
    }
  };

  // Get the selected icon component
  const getSelectedIcon = () => {
    const selectedIcon = ACCOUNT_ICONS.find((icon) => icon.id === formData.icon);
    if (selectedIcon) {
      const IconComponent = selectedIcon.icon;
      return <IconComponent className="h-6 w-6" />;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setIsCreateModalOpen(false)}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>New Account</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {errRes && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errRes}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="mb-4 border-green-500">
              <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Icon */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon<span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn('w-full justify-between', errors.icon && 'border-red-500')}
                  >
                    <div className="flex items-center gap-2">
                      {formData.icon ? (
                        <>
                          <div className="flex items-center justify-center h-6 w-6 rounded bg-muted">
                            {getSelectedIcon()}
                          </div>
                          <span>
                            {ACCOUNT_ICONS.find((icon) => icon.id === formData.icon)?.name ||
                              'Select icon'}
                          </span>
                        </>
                      ) : (
                        <span>Select icon</span>
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
              </Popover>
              {errors.icon && <p className="text-xs text-red-500">{errors.icon}</p>}
            </div>
          </div>

          {/* Type */}
          <div className="grid grid-cols-[120px_1fr] items-start gap-4">
            <Label htmlFor="type" className="text-right pt-2">
              Type<span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ACCOUNT_TYPES.PAYMENT}>{ACCOUNT_TYPES.PAYMENT}</SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.SAVING}>{ACCOUNT_TYPES.SAVING}</SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.CREDIT_CARD}>
                    {ACCOUNT_TYPES.CREDIT_CARD}
                  </SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.DEBT}>{ACCOUNT_TYPES.DEBT}</SelectItem>
                  <SelectItem value={ACCOUNT_TYPES.LENDING}>{ACCOUNT_TYPES.LENDING}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{currentTypeRules.description}</p>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name<span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter account name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
          </div>

          {/* Currency */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="currency" className="text-right">
              Currency<span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => handleChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VND">(đ) VND</SelectItem>
                <SelectItem value="USD">($) USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === ACCOUNT_TYPES.CREDIT_CARD && (
            <>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <Label htmlFor="available_limit" className="text-right">
                  Available Limit
                </Label>
                <div className="space-y-2">
                  <Input
                    id="available_limit"
                    value={formData.available_limit}
                    readOnly
                    placeholder="0.00"
                    className={cn(
                      'bg-gray-100 cursor-not-allowed',
                      errors.available_limit && 'border-red-500',
                      Number.parseFloat(formData.available_limit) < 0 && 'text-red-500',
                    )}
                  />
                  {errors.available_limit && (
                    <p className="text-xs text-red-500">{errors.available_limit}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <Label htmlFor="limit" className="text-right">
                  Credit Limit
                </Label>
                <div className="space-y-2">
                  <Input
                    id="limit"
                    value={formData.limit}
                    onChange={(e) => handleChange('limit', e.target.value)}
                    placeholder="0.00"
                    className={errors.limit ? 'border-red-500' : ''}
                  />
                  {errors.limit && <p className="text-xs text-red-500">{errors.limit}</p>}
                </div>
              </div>
            </>
          )}

          {/* Balance */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="balance" className="text-right">
              Balance
            </Label>
            <div className="space-y-2">
              <Input
                id="balance"
                type="number"
                value={formData.balance}
                onChange={(e) => handleChange('balance', e.target.value)}
                placeholder="0.00"
                className={cn(
                  errors.balance && 'border-red-500',
                  formData.balance?.startsWith('-') && 'text-red-500',
                )}
              />
              {errors.balance && <p className="text-xs text-red-500">{errors.balance}</p>}
            </div>
          </div>

          {/* Parent */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="parent" className="text-right">
              Parent
            </Label>
            <div className="space-y-2">
              <Select
                value={formData.parent}
                onValueChange={(value) => handleChange('parent', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent account" />
                </SelectTrigger>
                <SelectContent>
                  {parentAccounts.length > 0 ? (
                    parentAccounts?.map((account) => (
                      <SelectItem key={account?.id} value={account?.id}>
                        {account?.name} ({account?.type})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-accounts" value="no-accounts" disabled>
                      No parent accounts available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please fix the errors before submitting the form.</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="bg-muted/50 px-6 py-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
