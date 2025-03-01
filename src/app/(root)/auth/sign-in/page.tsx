import dynamic from 'next/dynamic';

const SignInPage = dynamic(() => import('@/features/auth/presentation/SignInPage'), {
  loading: () => <div>Loading...</div>,
});

const SignIn = () => {
  return (
    <section className="bg-muted py-16 px-2">
      <SignInPage />
    </section>
  );
};

export default SignIn;
