import PageContainer from '@/components/layouts/PageContainer';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { DashboardHeading } from '../../../components/DashboardHeading';

const AccountProfilePage = () => {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <DashboardHeading title="Profile" description="Manage Accounts" />
        </div>
        <Separator />
        <div>Profile Page</div>
      </div>
    </PageContainer>
  );
};

export default AccountProfilePage;
