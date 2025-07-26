// import { Currency } from '@/shared/types';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import { BudgetDetailFilterEnum } from '../../data/constants';
// import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
// import { Category } from '../../data/dto/response/CategoryResponseDTO';
// import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
// import { transformMonthlyPayload } from '../../utils/details/dataTransformations';
// import {
//   BudgetDetailFilterType,
//   BudgetInit,
//   BudgetPeriodIdType,
//   BudgetPeriodType,
//   MONTHS,
//   TableData,
// } from '../types/table.type';

// interface UseBudgetTableDataProps {
//   initialYear: number;
//   activeTab: BudgetDetailFilterType;
//   period: BudgetPeriodType;
//   periodId: BudgetPeriodIdType;
//   currency: Currency;
//   setSelectedCategories: (categories: Set<string>) => void;
//   table: BudgetInit<TableData>;
//   categories: BudgetInit<Category>;
//   budgetSummaryUseCase: IBudgetSummaryUseCase;
// }

// export function useBudgetTableData({
//   initialYear,
//   activeTab,
//   periodId,
//   currency,
//   setSelectedCategories,
//   table,
//   categories,
//   budgetSummaryUseCase,
// }: UseBudgetTableDataProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       await table.fetch();
//       await categories.fetch();
//       setIsLoading(false);
//     };
//     fetchData();
//   }, [initialYear, periodId, currency, activeTab]);

//   useEffect(() => {
//     const selectedCategoryIds = new Set<string>();
//     table.data.forEach((item: any) => {
//       if (item.categoryId) {
//         selectedCategoryIds.add(item.categoryId);
//       }
//     });

//     setSelectedCategories(selectedCategoryIds);
//   }, [table.data]);

//   const handleValueChange = (record: TableData, columnKey: string, value: number) => {
//     setIsLoading(true);
//     table.set((prevData) =>
//       prevData.map((item) => {
//         console.log(item.key, columnKey);

//         if (item.key === record.key) {
//           return {
//             ...item,
//             [columnKey]: value,
//           };
//         } else if (item.children) {
//           return {
//             ...item,
//             children: item.children.map((child: TableData) => {
//               if (child.key === record.key) {
//                 return {
//                   ...child,
//                   [columnKey]: value,
//                 };
//               }
//               return child;
//             }),
//           };
//         }
//         return item;
//       }),
//     );
//     setIsLoading(false);
//   };

//   const handleValidateClick = async (record: TableData) => {
//     setIsLoading(true);
//     try {
//       const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

//       if (record.key === 'top-down') {
//         const monthlyData = transformMonthlyPayload(record, activeTab);
//         await budgetSummaryUseCase.updateTopDownPlanning({
//           fiscalYear: initialYear.toString(),
//           type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
//           updateTopBudget: monthlyData,
//         });

//         table.fetch();
//         categories.fetch();

//         toast.success('Top-down planning updated successfully');
//       } else if (record.key.includes('-bottom-up')) {
//         const [categoryId] = record.key.split('-bottom-up');

//         if (!categoryId) {
//           toast.error('Invalid category ID');
//           return;
//         }

//         const bottomUpData = transformMonthlyPayload(record, activeTab);

//         const newCategoryRow = table.data.find((item: TableData) => item.key === 'new-category');

//         const actualRecord = newCategoryRow?.children?.find((child: TableData) => {
//           return child.key === 'actual-sum-up';
//         });

//         const actualData: MonthlyPlanningData = {};
//         for (let i = 1; i <= 12; i++) {
//           const monthKey = `m${i}${suffix}` as keyof MonthlyPlanningData;
//           actualData[monthKey] = 0;
//         }

//         if (actualRecord) {
//           MONTHS.forEach((month, index) => {
//             const value = actualRecord[month];
//             if (typeof value === 'number') {
//               const monthKey = `m${index + 1}${suffix}` as keyof MonthlyPlanningData;
//               actualData[monthKey] = value;
//             }
//           });
//         }

//         await budgetSummaryUseCase.updateCategoryPlanning(
//           {
//             fiscalYear: initialYear.toString(),
//             type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
//             categoryId,
//             bottomUpPlan: bottomUpData,
//             actualSumUpPlan: actualData,
//           },
//           currency,
//         );

//         table.fetch();
//         categories.fetch();

//         toast.success('Bottom-up planning updated successfully');
//       }
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to update planning');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClearTopDown = async () => {
//     setIsLoading(true);
//     try {
//       const clearedData = table.data.map((item) => {
//         if (item.key === 'top-down') {
//           const clearedItem = { ...item };
//           Object.keys(clearedItem).forEach((key) => {
//             if (key !== 'key' && key !== 'type' && key !== 'action' && key !== 'isEditable') {
//               clearedItem[key] = { value: 0 };
//             }
//           });
//           return clearedItem;
//         }
//         return item;
//       });

//       table.set(clearedData);

//       const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
//       const monthlyData: MonthlyPlanningData = {};
//       for (let i = 1; i <= 12; i++) {
//         const monthKey = `m${i}${suffix}` as keyof MonthlyPlanningData;
//         monthlyData[monthKey] = 0;
//       }

//       await budgetSummaryUseCase.updateTopDownPlanning({
//         fiscalYear: initialYear.toString(),
//         type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
//         updateTopBudget: monthlyData,
//       });

//       toast.success('Total Top Down cleared and synced successfully');
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to clear and sync Total Top Down');
//       // Rollback nếu API thất bại (tùy chọn)
//       table.fetch();
//       categories.fetch();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     isLoading,
//     handleValueChange,
//     handleValidateClick,
//     handleClearTopDown,
//   };
// }
