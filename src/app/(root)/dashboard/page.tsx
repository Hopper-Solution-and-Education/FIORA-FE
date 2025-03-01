'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Đang tải...</div>;
  if (!session) redirect('/auth/sign-in');

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-primary mb-6">
            Đăng nhập thành công
          </h1>
          <p className="text-lg text-muted-foreground mb-6 text-center">
            Chúc mừng bạn đã đăng nhập thành công vào hệ thống. Hãy bắt đầu hành trình của bạn ngay
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
