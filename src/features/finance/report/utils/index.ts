import {
  ChartByAccount,
  ChartByCategory,
  ChartByDate,
  ChartByPartner,
  ChartByProduct,
  TableByAccount,
  TableByCategory,
  TableByDate,
  TableByPartner,
  TableByProduct,
} from '../presentation/organisms';
import { ViewBy } from '../slices/types';

export const chartComponents: Record<ViewBy, React.ComponentType> = {
  date: ChartByDate,
  category: ChartByCategory,
  account: ChartByAccount,
  product: ChartByProduct,
  partner: ChartByPartner,
};

export const tableComponents: Record<ViewBy, React.ComponentType> = {
  date: TableByDate,
  category: TableByCategory,
  account: TableByAccount,
  product: TableByProduct,
  partner: TableByPartner,
};
