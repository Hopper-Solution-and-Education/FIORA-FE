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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Account, CreateAccountModalProps } from '../../../settingSlices/expenseIncomeSlides/types';
import {
  ACCOUNT_ICONS,
  ACCOUNT_RULES,
  ACCOUNT_TYPES,
  FALLBACK_PARENT_ACCOUNTS,
  PARENT_ACCOUNTS,
} from '../mockData';

export function CreateAccountModal({
  isOpen,
  onClose,
  onSubmit,
  errRes,
  successMessage,
}: CreateAccountModalProps) {
  const [formData, setFormData] = useState({
    icon: '',
    type: ACCOUNT_TYPES.PAYMENT,
    name: '',
    currency: 'USD',
    limit: '',
    balance: '',
    parent: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableParents, setAvailableParents] = useState(PARENT_ACCOUNTS);
  const [availableIcons, setAvailableIcons] = useState(ACCOUNT_ICONS);
  const [parentAccounts, setParentAccounts] = useState<Account[]>([]);

  // Get the current account type rules
  const currentTypeRules = ACCOUNT_RULES[formData.type];

  // Update available parents and icons when account type changes
  useEffect(() => {
    if (formData.parent) {
      const selectedParent = PARENT_ACCOUNTS.find((p) => p.id === formData.parent);
      if (selectedParent && selectedParent.type !== formData.type) {
        setFormData((prev) => ({ ...prev, parent: '' }));
      }
    }

    // Filter available parents based on selected type
    const filteredParents = PARENT_ACCOUNTS.filter((p) => p.type === formData.type);
    setAvailableParents(filteredParents);

    // Filter available icons based on selected type
    const filteredIcons = ACCOUNT_ICONS.filter((icon) => icon.types.includes(formData.type));
    setAvailableIcons(filteredIcons);

    // If current icon is not valid for the new type, reset it
    if (formData.icon) {
      const iconStillValid = filteredIcons.some((icon) => icon.id === formData.icon);
      if (!iconStillValid) {
        setFormData((prev) => ({
          ...prev,
          icon: filteredIcons.length > 0 ? filteredIcons[0].id : '',
        }));
      }
    } else if (filteredIcons.length > 0) {
      // Set default icon for the type if none is selected
      setFormData((prev) => ({ ...prev, icon: filteredIcons[0].id }));
    }
  }, [formData.type, formData.parent, formData.icon]); // Added formData.icon to dependencies

  useEffect(() => {
    // fetching data from API to get the available parents and icons
    fetchParents();
  }, []);

  // Fetch parent accounts from API
  const fetchParents = async () => {
    try {
      const res = await fetch('/api/accounts/lists?isParent=true', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Failed to fetch parent accounts');
        setParentAccounts(FALLBACK_PARENT_ACCOUNTS);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data.accounts)) {
        setParentAccounts(data.accounts);
      } else {
        console.error('Unexpected API response format');
        setParentAccounts(FALLBACK_PARENT_ACCOUNTS);
      }
    } catch (error) {
      console.error('Error fetching parent accounts:', error);
      setParentAccounts(FALLBACK_PARENT_ACCOUNTS);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchParents();
  }, []); // Removed fetchParents from dependencies

  // Validate form data
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

  const handleSubmit = () => {
    if (validateForm()) {
      // If balance is empty, set it to 0
      const finalData = {
        ...formData,
        balance: formData.balance || '0',
      };
      onSubmit(finalData);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
                <PopoverContent className="w-full p-0">
                  <div className="max-h-[300px] overflow-auto p-1">
                    {availableIcons.length > 0 ? (
                      availableIcons.map((icon) => (
                        <Button
                          key={icon.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleChange('icon', icon.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-6 w-6 rounded bg-muted">
                              <icon.icon className="h-4 w-4" />
                            </div>
                            <span>{icon.name}</span>
                          </div>
                        </Button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No icons available for this account type
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {errors.icon && <p className="text-xs text-red-500">{errors.icon}</p>}
            </div>
          </div>

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
                <SelectItem value="USD">($) USD</SelectItem>
                <SelectItem value="VND">(đ) VND</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === ACCOUNT_TYPES.CREDIT_CARD && (
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
          )}

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="balance" className="text-right">
              Balance
            </Label>
            <div className="space-y-2">
              <Input
                id="balance"
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
                    parentAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No parent accounts available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Parent account must be of the same type. Sub-account balance will be included in
                parent balance.
              </p>
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   AlertCircle,
//   Wallet,
//   CreditCard,
//   PiggyBank,
//   TrendingDown,
//   Banknote,
//   ChevronDown,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { cn } from '@/lib/utils';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

// // Define the Account interface based on the API response
// interface Account {
//   id: string;
//   userId: string;
//   icon: string;
//   name: string;
//   description: string;
//   type: string;
//   currency: string;
//   limit: string;
//   balance: string;
//   parentId: string | null;
// }

// // Define account types and their rules
// const ACCOUNT_TYPES = {
//   PAYMENT: 'Payment',
//   SAVING: 'Saving',
//   CREDIT_CARD: 'CreditCard',
//   DEBT: 'Dept',
//   LENDING: 'Lending',
// };

// // Define account type validation rules
// const ACCOUNT_RULES = {
//   [ACCOUNT_TYPES.PAYMENT]: {
//     minBalance: 0,
//     maxBalance: null,
//     description: 'Use to record daily payment and transfer transactions. Balance must be >= 0.',
//   },
//   [ACCOUNT_TYPES.SAVING]: {
//     minBalance: 0,
//     maxBalance: null,
//     description: 'Use to record saving transactions and interest only. Balance must be >= 0.',
//   },
//   [ACCOUNT_TYPES.CREDIT_CARD]: {
//     minBalance: null,
//     maxBalance: 0,
//     description:
//       'Use to record daily payment and transfer (only internal transfer) transactions. Balance must be <= 0.',
//   },
//   [ACCOUNT_TYPES.DEBT]: {
//     minBalance: null,
//     maxBalance: 0,
//     description: 'Use to record loan transactions only. Balance must be <= 0.',
//   },
//   [ACCOUNT_TYPES.LENDING]: {
//     minBalance: 0,
//     maxBalance: null,
//     description: 'Use to record lending transactions only. Balance must be >= 0.',
//   },
// };

// // // Define icons for each account type
// const ACCOUNT_ICONS = [
//   { id: 'wallet', name: 'Wallet', icon: Wallet, types: [ACCOUNT_TYPES.PAYMENT] },
//   { id: 'piggy-bank', name: 'Piggy Bank', icon: PiggyBank, types: [ACCOUNT_TYPES.SAVING] },
//   { id: 'credit-card', name: 'Credit Card', icon: CreditCard, types: [ACCOUNT_TYPES.CREDIT_CARD] },
//   { id: 'trending-down', name: 'Debt', icon: TrendingDown, types: [ACCOUNT_TYPES.DEBT] },
//   { id: 'banknote', name: 'Lending', icon: Banknote, types: [ACCOUNT_TYPES.LENDING] },
// ];

// // Sample parent accounts for fallback

// interface CreateAccountModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
// }

// export function CreateAccountModal({ isOpen, onClose, onSubmit }: CreateAccountModalProps) {
//   const [formData, setFormData] = useState({
//     icon: '',
//     type: ACCOUNT_TYPES.PAYMENT,
//     name: '',
//     currency: 'USD',
//     limit: '',
//     balance: '',
//     parent: '',
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [parentAccounts, setParentAccounts] = useState<Account[]>([]);
//   const [availableIcons, setAvailableIcons] = useState(ACCOUNT_ICONS);
//   // Get the current account type rules
//   const currentTypeRules = ACCOUNT_RULES[formData.type] || ACCOUNT_RULES[ACCOUNT_TYPES.PAYMENT];

//   // Fetch parent accounts from API
//   const fetchParents = async () => {
//     try {
//       const res = await fetch('/api/accounts/lists?isParent=true', {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!res.ok) {
//         console.error('Failed to fetch parent accounts');
//         setParentAccounts(FALLBACK_PARENT_ACCOUNTS);
//         return;
//       }

//       const data = await res.json();

//       if (Array.isArray(data.accounts)) {
//         setParentAccounts(data.accounts);
//       } else {
//         console.error('Unexpected API response format');
//         setParentAccounts(FALLBACK_PARENT_ACCOUNTS);
//       }
//     } catch (error) {
//       console.error('Error fetching parent accounts:', error);
//       setParentAccounts(FALLBACK_PARENT_ACCOUNTS);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchParents();
//   }, []); // Removed fetchParents from dependencies

//   useEffect(() => {
//     // Filter available icons based on selected type
//     const filteredIcons = ACCOUNT_ICONS.filter((icon) => icon.types.includes(formData.type));
//     setAvailableIcons(filteredIcons);

//     // If current icon is not valid for the new type, reset it
//     if (formData.icon) {
//       const iconStillValid = filteredIcons.some((icon) => icon.id === formData.icon);
//       if (!iconStillValid) {
//         setFormData((prev) => ({
//           ...prev,
//           icon: filteredIcons.length > 0 ? filteredIcons[0].id : '',
//         }));
//       }
//     } else if (filteredIcons.length > 0) {
//       // Set default icon for the type if none is selected
//       setFormData((prev) => ({ ...prev, icon: filteredIcons[0].id }));
//     }
//   }, [formData.type, formData.parent, formData.icon]); // Added formData.icon to dependencies

//   // Handle parent account selection
// const handleParentChange = (parentId: string) => {
//   // Find the selected parent account
//   const selectedParent = parentAccounts.find((p) => p.id === parentId);

//   if (selectedParent) {
//     // Update the parent and type in the form data
//     setFormData((prev) => ({
//       ...prev,
//       parent: parentId,
//       type: selectedParent.type, // Set the type to match the parent's type
//     }));
//   } else {
//     // Just update the parent if no matching parent found
//     setFormData((prev) => ({
//       ...prev,
//       parent: parentId,
//     }));
//   }

//   // Clear any parent-related errors
//   if (errors.parent) {
//     setErrors((prev) => {
//       const newErrors = { ...prev };
//       delete newErrors.parent;
//       return newErrors;
//     });
//   }
// };

//   const getSelectedIcon = () => {
//     const selectedIcon = ACCOUNT_ICONS.find((icon) => icon.id === formData.icon);
//     if (selectedIcon) {
//       const IconComponent = selectedIcon.icon;
//       return <IconComponent className="h-6 w-6" />;
//     }
//     return null;
//   };

//   // Validate form data
//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     // Required fields
//     if (!formData.name.trim()) {
//       newErrors.name = 'Account name is required';
//     }

//     // Balance validation based on account type
//     if (formData.balance) {
//       const balanceValue = Number.parseFloat(formData.balance);

//       if (isNaN(balanceValue)) {
//         newErrors.balance = 'Balance must be a valid number';
//       } else {
//         // Check min balance constraint
//         if (currentTypeRules.minBalance !== null && balanceValue < currentTypeRules.minBalance) {
//           newErrors.balance = `Balance must be greater than or equal to ${currentTypeRules.minBalance}`;
//         }

//         // Check max balance constraint
//         if (currentTypeRules.maxBalance !== null && balanceValue > currentTypeRules.maxBalance) {
//           newErrors.balance = `Balance must be less than or equal to ${currentTypeRules.maxBalance}`;
//         }
//       }
//     }

//     // Credit limit validation for Credit Card
//     if (formData.type === ACCOUNT_TYPES.CREDIT_CARD) {
//       if (formData.limit) {
//         const limitValue = Number.parseFloat(formData.limit);

//         if (isNaN(limitValue)) {
//           newErrors.limit = 'Credit limit must be a valid number';
//         } else if (limitValue <= 0) {
//           newErrors.limit = 'Credit limit must be greater than 0';
//         }

//         // Check if balance exceeds credit limit
//         if (formData.balance && !newErrors.balance) {
//           const balanceValue = Number.parseFloat(formData.balance);
//           if (balanceValue < -limitValue) {
//             newErrors.balance = `Balance cannot be lower than -${formData.limit} (credit limit)`;
//           }
//         }
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (field: string, value: string) => {
//     // For parent field, use the special handler
//     if (field === 'parent') {
//       handleParentChange(value);
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [field]: value }));

//     // Clear error when field is changed
//     if (errors[field]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       // If balance is empty, set it to 0
//       const finalData = {
//         ...formData,
//         balance: formData.balance || '0',
//       };
//       onSubmit(finalData);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
//         <DialogHeader className="px-6 pt-6 pb-2">
//           <DialogTitle>New Account</DialogTitle>
//         </DialogHeader>
//         <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
//           <div className="grid grid-cols-[120px_1fr] items-center gap-4">
//             <Label htmlFor="icon" className="text-right">
//               Icon<span className="text-red-500">*</span>
//             </Label>
//             <div className="space-y-2">
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     className={cn('w-full justify-between', errors.icon && 'border-red-500')}
//                   >
//                     <div className="flex items-center gap-2">
//                       {formData.icon ? (
//                         <>
//                           <div className="flex items-center justify-center h-6 w-6 rounded bg-muted">
//                             {getSelectedIcon()}
//                           </div>
//                           <span>
//                             {ACCOUNT_ICONS.find((icon) => icon.id === formData.icon)?.name ||
//                               'Select icon'}
//                           </span>
//                         </>
//                       ) : (
//                         <span>Select icon</span>
//                       )}
//                     </div>
//                     <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-full p-0">
//                   <div className="max-h-[300px] overflow-auto p-1">
//                     {availableIcons.length > 0 ? (
//                       availableIcons.map((icon) => (
//                         <Button
//                           key={icon.id}
//                           variant="ghost"
//                           className="w-full justify-start"
//                           onClick={() => handleChange('icon', icon.id)}
//                         >
//                           <div className="flex items-center gap-2">
//                             <div className="flex items-center justify-center h-6 w-6 rounded bg-muted">
//                               <icon.icon className="h-4 w-4" />
//                             </div>
//                             <span>{icon.name}</span>
//                           </div>
//                         </Button>
//                       ))
//                     ) : (
//                       <div className="p-4 text-center text-sm text-muted-foreground">
//                         No icons available for this account type
//                       </div>
//                     )}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//               {errors.icon && <p className="text-xs text-red-500">{errors.icon}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-[120px_1fr] items-center gap-4">
//             <Label htmlFor="parent" className="text-right">
//               Parent
//             </Label>
//             <div className="space-y-2">
//               <Select
//                 value={formData.parent}
//                 onValueChange={(value) => handleChange('parent', value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select parent account" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {parentAccounts.length > 0 ? (
//                     parentAccounts.map((account) => (
//                       <SelectItem key={account.id} value={account.id}>
//                         {account.name} ({account.type})
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value="" disabled>
//                       No parent accounts available
//                     </SelectItem>
//                   )}
//                 </SelectContent>
//               </Select>
//               <p className="text-xs text-muted-foreground">
//                 Selecting a parent account will automatically set the account type to match the
//                 parent.
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-[120px_1fr] items-start gap-4">
//             <Label htmlFor="type" className="text-right pt-2">
//               Type<span className="text-red-500">*</span>
//             </Label>
//             <div className="space-y-2">
//               <Select
//                 value={formData.type}
//                 onValueChange={(value) => handleChange('type', value)}
//                 disabled={!!formData.parent} // Disable type selection if parent is selected
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={ACCOUNT_TYPES.PAYMENT}>{ACCOUNT_TYPES.PAYMENT}</SelectItem>
//                   <SelectItem value={ACCOUNT_TYPES.SAVING}>{ACCOUNT_TYPES.SAVING}</SelectItem>
//                   <SelectItem value={ACCOUNT_TYPES.CREDIT_CARD}>
//                     {ACCOUNT_TYPES.CREDIT_CARD}
//                   </SelectItem>
//                   <SelectItem value={ACCOUNT_TYPES.DEBT}>{ACCOUNT_TYPES.DEBT}</SelectItem>
//                   <SelectItem value={ACCOUNT_TYPES.LENDING}>{ACCOUNT_TYPES.LENDING}</SelectItem>
//                 </SelectContent>
//               </Select>
//               <p className="text-xs text-muted-foreground">
//                 {formData.parent
//                   ? 'Type is determined by the selected parent account.'
//                   : currentTypeRules.description}
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-[120px_1fr] items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Name<span className="text-red-500">*</span>
//             </Label>
//             <div className="space-y-2">
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter account name"
//                 className={errors.name ? 'border-red-500' : ''}
//               />
//               {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-[120px_1fr] items-center gap-4">
//             <Label htmlFor="currency" className="text-right">
//               Currency<span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value={formData.currency}
//               onValueChange={(value) => handleChange('currency', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select currency" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="USD">($) USD</SelectItem>
//                 <SelectItem value="VND">(đ) VND</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {formData.type === ACCOUNT_TYPES.CREDIT_CARD && (
//             <div className="grid grid-cols-[120px_1fr] items-center gap-4">
//               <Label htmlFor="limit" className="text-right">
//                 Credit Limit
//               </Label>
//               <div className="space-y-2">
//                 <Input
//                   id="limit"
//                   value={formData.limit}
//                   onChange={(e) => handleChange('limit', e.target.value)}
//                   placeholder="0.00"
//                   className={errors.limit ? 'border-red-500' : ''}
//                 />
//                 {errors.limit && <p className="text-xs text-red-500">{errors.limit}</p>}
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-[120px_1fr] items-center gap-4">
//             <Label htmlFor="balance" className="text-right">
//               Balance
//             </Label>
//             <div className="space-y-2">
//               <Input
//                 id="balance"
//                 value={formData.balance}
//                 onChange={(e) => handleChange('balance', e.target.value)}
//                 placeholder="0.00"
//                 className={cn(
//                   errors.balance && 'border-red-500',
//                   formData.balance?.startsWith('-') && 'text-red-500',
//                 )}
//               />
//               {errors.balance && <p className="text-xs text-red-500">{errors.balance}</p>}
//             </div>
//           </div>

//           {Object.keys(errors).length > 0 && (
//             <Alert variant="destructive" className="mt-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>Please fix the errors before submitting the form.</AlertDescription>
//             </Alert>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/50 px-6 py-4">
//           <div className="flex justify-between w-full">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit}>Submit</Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
