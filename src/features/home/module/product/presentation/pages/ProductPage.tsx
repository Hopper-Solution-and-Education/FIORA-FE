import PageContainer from '@/components/layouts/PageContainer';
import { Separator } from '@/components/ui/separator';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import AddProductDialog from '../organisms/AddProductDialog';

const ProductPage = () => {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <DashboardHeading title="Products" description="Manage products" />
          <AddProductDialog />
        </div>

        <Separator />
        <div>Product Page</div>
      </div>
    </PageContainer>
  );
};

export default ProductPage;
