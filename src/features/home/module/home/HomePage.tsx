import PageContainer from '@/components/layouts/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AccountsOverview } from './AccountOverview';
import { AreaGraph } from './components/AreaGraph';
import BarGraph from './components/BarGraph';
import PieGraph from './components/PieGraph';
import RecentTransactions from './components/RecentTransactions';
import Recommendations from './components/Recommendations';
import FinancialOverview from './FinancialOverview';

export default function HomePage() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Home</h2>
          <div className="hidden items-center space-x-2 md:flex"></div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
              {/* Left Section: Financial & Account Overview */}
              <div className="col-span-1 md:col-span-2 lg:col-span-7 space-y-4">
                <div className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] overflow-y-auto">
                  <FinancialOverview />
                </div>
                <AccountsOverview />
              </div>

              {/* Right Section: Transactions & Recommendations */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
                <RecentTransactions />
                <Recommendations />
              </div>

              {/* Graphs Section */}
              <div className="col-span-1 md:col-span-2 lg:col-span-10 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg font-semibold">
                      Financial Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarGraph />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg font-semibold">
                        Area Graph
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AreaGraph />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg font-semibold">
                        Pie Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieGraph />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
