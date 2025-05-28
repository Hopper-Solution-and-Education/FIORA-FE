import { ChartByAccount, ChartByPartner, ChartByProduct } from '../presentation/organisms';
import { ChartByDate } from '../presentation/organisms';
import { ChartByCategory } from '../presentation/organisms';
import { ViewBy } from '../slices/types';

// Object mapping để ánh xạ viewBy với cấu hình MultiSelectPicker
export const multiSelectConfig: Partial<
  Record<
    ViewBy,
    { placeholder: string; options: any[]; selectedValues: any[]; onChange: () => void }
  >
> = {
  account: {
    placeholder: 'Select accounts',
    options: [],
    selectedValues: [],
    onChange: () => {},
  },
  product: {
    placeholder: 'Select products',
    options: [],
    selectedValues: [],
    onChange: () => {},
  },
  partner: {
    placeholder: 'Select partners',
    options: [],
    selectedValues: [],
    onChange: () => {},
  },
};

export const chartComponents: Record<ViewBy, React.ComponentType> = {
  date: ChartByDate,
  category: ChartByCategory,
  account: ChartByAccount,
  product: ChartByProduct,
  partner: ChartByPartner,
};
