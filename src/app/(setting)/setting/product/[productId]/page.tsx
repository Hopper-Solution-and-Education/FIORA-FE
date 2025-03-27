import PageContainer from '@/components/layouts/PageContainer';

export const metadata = {
  title: 'Dashboard : Product View',
};

type PageProps = { params: Promise<{ productId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <>{params.productId}</>
    </PageContainer>
  );
}
