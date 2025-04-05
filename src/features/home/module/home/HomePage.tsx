import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MODULE } from '@/shared/constants';
import { AccountsOverview } from './AccountOverview';
import RecentTransactions from './components/RecentTransactions';
import Recommendations from './components/Recommendations';
import AccountPage from '@/app/(home)/account/page';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setModule } from '@/store/slices/moduleSlice';

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setModule(MODULE.HOME));
  }, [dispatch]);

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
              <AccountPage />
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
