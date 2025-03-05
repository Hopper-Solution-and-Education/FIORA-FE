import PageContainer from '@/components/layouts/PageContainer';
import { DashboardHeading } from '../../components/DashboardHeading';
import FormManager from './FormManager';

const BannerPage = () => {
  return (
    <PageContainer>
      <div className="w-full">
        <div className="w-full">
          <DashboardHeading title="Banner Manager" description="Manage Banner and UI" />
          <FormManager />
        </div>
      </div>
    </PageContainer>
  );
};

export default BannerPage;
