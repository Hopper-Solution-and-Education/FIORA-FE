'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MODULE } from '@/shared/constants';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { useFeatureFlagGuard } from '@/shared/hooks/useFeatureFlagGuard';
import AccountDashboard from '../account/AccountDashboard';
import { AccountsOverview } from './AccountOverview';
import RecentTransactions from './components/RecentTransactions';
import Recommendations from './components/Recommendations';

export default function HomePage() {
  const { isFeatureOn } = useFeatureFlagGuard(FeatureFlags.ACCOUNT_FEATURE, MODULE.HOME);

  if (!isFeatureOn) {
    return null;
  }
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Home</h2>
        <div className="hidden items-center space-x-2 md:flex"></div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
            {/* Left Section: Financial & Account Overview */}
            <div className="col-span-1 md:col-span-2 lg:col-span-7 space-y-4">
              {isFeatureOn && <AccountDashboard module={MODULE.HOME} />}
              <AccountsOverview />
            </div>

            {/* Right Section: Transactions & Recommendations */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
              <RecentTransactions />
              <Recommendations />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
