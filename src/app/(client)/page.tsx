import dynamic from 'next/dynamic';

const LandingPageRender = dynamic(() => import('@/features/landing/presentation/LandingPage'), {
  loading: () => <div>Loading...</div>,
});

function page() {
  return <LandingPageRender />;
}

export default page;
