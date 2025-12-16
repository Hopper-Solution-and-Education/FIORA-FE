'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ChartByDate } from '@/features/finance/report/presentation/organisms';
import { getFinanceByDateAsyncThunk } from '@/features/finance/report/slices/actions';
import { FeatureFlags, MODULE } from '@/shared/constants';
import { useAppDispatch } from '@/store';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useEffect } from 'react';
import AccountDashboard from '../account/AccountDashboard';
import RecentTransactions from './components/RecentTransactions';

export default function HomePage() {
  const isAccountFeatureOn = useFeatureIsOn(FeatureFlags.ACCOUNT_FEATURE as any);
  const isFinanceFeatureOn = useFeatureIsOn(FeatureFlags.FINANCE_FEATURE as any);
  const dispatch = useAppDispatch();

  // get nearly five years data
  useEffect(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear() - 5, 0, 1);

    dispatch(
      getFinanceByDateAsyncThunk({
        from: startOfYear.toISOString(),
        to: today.toISOString(),
      }),
    );
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-4 px-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
            {/* Left Section: Financial & Account Overview */}
            <div className="col-span-1 md:col-span-2 lg:col-span-7 space-y-4">
              {isAccountFeatureOn && <AccountDashboard module={MODULE.HOME} />}
              {isFinanceFeatureOn && <ChartByDate title="Finance Chart" />}
            </div>

            {/* Right Section: Transactions & Recommendations */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
              <RecentTransactions />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
