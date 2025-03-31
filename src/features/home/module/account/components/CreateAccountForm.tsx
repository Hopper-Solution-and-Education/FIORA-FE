// 'use client';

// import GlobalForm from '@/components/common/organisms/GlobalForm';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { createAccount } from '@/features/home/module/account/slices/actions';
// import {
//   defaultNewAccountValues,
//   validateNewAccountSchema,
// } from '@/features/home/module/account/slices/types/formSchema';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';
// import GlobalIconSelect from '@/components/common/atoms/GlobalIconSelect';
// import InputField from '@/components/common/atoms/InputField';
// import { ACCOUNT_TYPES } from '@/shared/constants/account';
// import {
//   TypeSelect,
//   CurrencySelect,
//   LimitField,
//   AvailableLimitDisplay,
//   BalanceField,
//   ParentAccountSelect,
// } from './AccountFormFields';

// export default function CreateAccountForm() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const { parentAccounts } = useAppSelector((state) => state.account);

//   const parentOptions =
//     parentAccounts.data?.map((account) => ({
//       value: account.id,
//       label: account.name,
//       type: account.type,
//     })) || [];

//   const fields = [
//     <GlobalIconSelect key="icon" name="icon" />,
//     <TypeSelect key="type" name="type" />,
//     <InputField key="name" name="name" placeholder="Account Name" />,
//     <CurrencySelect key="currency" name="currency" />,
//     <LimitField key="limit" name="limit" />,
//     <AvailableLimitDisplay key="availableLimit" />,
//     <BalanceField key="balance" name="balance" />,
//     <ParentAccountSelect key="parentId" name="parentId" options={parentOptions} />,
//   ];

//   const onSubmit = async (data) => {
//     try {
//       const finalData = {
//         ...data,
//         balance:
//           data.type === ACCOUNT_TYPES.CREDIT_CARD
//             ? -Number(data.balance)
//             : Number(data.balance) || 0,
//         limit: data.limit ? Number(data.limit) : undefined,
//         parentId: data.parentId || undefined,
//       };
//       await dispatch(createAccount(finalData)).unwrap();
//       toast.success('Account created successfully');
//       router.push('/home/account');
//     } catch (error) {
//       console.error('Error creating account:', error);
//       toast.error('Failed to create account');
//     }
//   };

//   return (
//     <GlobalForm
//       fields={fields}
//       onSubmit={onSubmit}
//       defaultValues={defaultNewAccountValues}
//       schema={validateNewAccountSchema}
//     />
//   );
// }
