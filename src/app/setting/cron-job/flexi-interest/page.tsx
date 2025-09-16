import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const FlexiInterestCronjobDashboardPage = dynamic(
  () =>
    import(
      '@/features/setting/module/cron-job/module/flexi-interest/presentation/pages/FlexiInterestCronjobDashboardPage'
    ),
  { loading: () => <Loading /> },
);

function Page() {
  return <FlexiInterestCronjobDashboardPage />;
}

export default Page;
