import dynamic from 'next/dynamic';

const SignUpPage = dynamic(() => import('@/features/auth/presentation/SignUpPage'), {
  loading: () => <div>Loading...</div>,
});

const SignIn = () => {
  return (
    <section className="bg-muted py-16 px-2">
      <SignUpPage />
    </section>
  );
};

export default SignIn;
