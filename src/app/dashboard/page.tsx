import { redirect } from 'next/navigation';

const page = () => {
  redirect('/dashboard/home');

  return <div>page</div>;
};

export default page;
