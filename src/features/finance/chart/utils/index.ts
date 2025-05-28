import {
  ChartByAccount,
  ChartByCategory,
  ChartByDate,
  ChartByPartner,
  ChartByProduct,
} from '../presentation/organisms';
import { ViewBy } from '../slices/types';

export const chartComponents: Record<ViewBy, React.ComponentType> = {
  date: ChartByDate,
  category: ChartByCategory,
  account: ChartByAccount,
  product: ChartByProduct,
  partner: ChartByPartner,
};
