import dynamic from 'next/dynamic';

const ForgotPasswordPage = dynamic(
  () => import('@/features/auth/presentation/ForgotPasswordPage'),
  {
    loading: () => <div>Loading...</div>,
  },
);

const SignIn = () => {
  return (
    <section className="bg-muted py-16 px-2">
      <ForgotPasswordPage />
    </section>
  );
};

export default SignIn;
