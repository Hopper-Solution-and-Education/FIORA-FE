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

export interface BudgetActions {
  setTotalExpense: (value: number) => void;
  setTotalIncome: (value: number) => void;
  handleEdit: (key: string | number, value: string, type?: BudgetType) => void;
  toggleEdit: (key: string | number) => void;
  handleBlur: (key: string | number) => void;
  generateBudget: () => void;
}
