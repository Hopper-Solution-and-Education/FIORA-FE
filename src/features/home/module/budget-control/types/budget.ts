export type BudgetType = 'expense' | 'income';

export interface EditableCellProps {
  value: number;
  onEdit: (value: string) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  onBlur: () => void;
  className?: string;
}

export interface BudgetData {
  totalExpense: number;
  totalIncome: number;
  editableValues: { [key: string]: number };
  plannedIncome: { [key: string]: number };
  trueExpense: number[];
  trueIncome: number[];
}
