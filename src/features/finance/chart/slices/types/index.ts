import { Account, FinanceByDate, FinanceResult, Partner, Product } from '../../domain/entities';

export type ViewBy = 'date' | 'category' | 'account' | 'product' | 'partner';
export type ViewChartByCategory = 'income' | 'expense';
interface FinanceControlState {
  isLoadingGetFinance: boolean;
  viewBy: ViewBy;
  viewChartByCategory: 'income' | 'expense';
  financeByDate: FinanceByDate[];
  financeByCategory: FinanceResult[];
  financeByAccount: FinanceResult[];
  financeByProduct: FinanceResult[];
  financeByPartner: FinanceResult[];
  accounts: {
    isLoadingGetAccounts: boolean;
    data: Account[];
  };
  products: {
    isLoadingGetProducts: boolean;
    data: Product[];
  };
  partners: {
    isLoadingGetPartners: boolean;
    data: Partner[];
  };
  selectedAccounts: string[];
  selectedProducts: string[];
  selectedPartners: string[];
}

export const initialFinanceControlState: FinanceControlState = {
  isLoadingGetFinance: false,
  viewBy: 'date',
  viewChartByCategory: 'income',
  financeByDate: [],
  financeByCategory: [],
  financeByAccount: [],
  financeByProduct: [],
  financeByPartner: [],
  accounts: {
    isLoadingGetAccounts: false,
    data: [],
  },
  products: {
    isLoadingGetProducts: false,
    data: [],
  },
  partners: {
    isLoadingGetPartners: false,
    data: [],
  },
  selectedAccounts: [],
  selectedProducts: [],
  selectedPartners: [],
};
