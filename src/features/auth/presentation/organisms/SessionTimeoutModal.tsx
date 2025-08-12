'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SessionTimeoutModal() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(30); // Đếm ngược 30 giây
  const router = useRouter();

  useEffect(() => {
    // Nếu đang tải session hoặc không có session, không làm gì
    if (status === 'loading' || !session) return;

    const expiresAt = new Date(session.expires).getTime(); // Thời gian hết hạn (timestamp)
    const now = Date.now(); // Thời gian hiện tại
    const timeLeft = expiresAt - now; // Thời gian còn lại (ms)

    // Hiển thị modal nếu còn dưới 5 phút (300,000 ms)
    if (timeLeft <= 300000 && timeLeft > 0) {
      setIsVisible(true);
    }

    // Nếu modal đang hiển thị, bắt đầu đếm ngược
    if (isVisible) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleLogout(); // Tự động đăng xuất khi đếm ngược về 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Cập nhật mỗi giây

      // Dọn dẹp timer khi component unmount hoặc effect chạy lại
      return () => clearInterval(timer);
    }
  }, [session, status, isVisible]);

  const handleRefresh = async () => {
    // Gọi API để gia hạn session
    const res = await fetch('/api/auth/refresh', { method: 'POST' });
    if (res.ok) {
      setIsVisible(false); // Ẩn modal
      setCountdown(30); // Reset đếm ngược
      // Lưu ý: NextAuth sẽ tự động cập nhật session nếu API refresh thành công
    }
  };

  const handleLogout = () => {
    // Gọi API để đăng xuất
    fetch('/api/auth/logout', { method: 'POST' }).then(() => {
      localStorage.removeItem('isLogged'); // Xóa trạng thái đăng nhập
      setIsVisible(false); // Ẩn modal
      router.push('/'); // Chuyển hướng về trang chủ
    });
  };

  // Không hiển thị modal nếu không cần
  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phiên đăng nhập sắp hết hạn</DialogTitle>
          <DialogDescription>
            Phiên đăng nhập của bạn sẽ hết hạn sau {countdown} giây. Bạn muốn gia hạn?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleRefresh}>
            Gia hạn
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
