import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { NotificationDetails } from '../organisms/NotificationDetails';
import { RecipientList } from '../organisms/RecipientList';

const NotificationSettingPage = () => {
  //   const notification = {
  //     title: 'Hỗ trợ danh sách tài khoản truy cập thông báo FIORA',
  //     sender: 'admin@fiora.com',
  //     type: 'Support',
  //     sentAt: '09/06/2025, 08:25:00',
  //     content: `Kính gửi (tên),

  // Chúc bạn một ngày tốt lành.

  // Đề bài: Hỗ trợ danh sách tài khoản truy cập thông báo FIORA.

  // 1. Bạn cần đăng nhập vào hệ thống KYC.
  // 2. Bạn cần tải lên các tài liệu cần thiết để hoàn tất quy trình KYC.
  // 3. Sau khi hoàn tất, bạn sẽ nhận được thông báo từ hệ thống.

  // Trân trọng,
  // Đội ngũ hỗ trợ KYC - Sau đăng nhập, tìm mục "KYC" trong tài khoản của bạn.
  // Nếu bạn gặp khó khăn trong việc thực hiện, vui lòng liên hệ với bộ phận hỗ trợ qua email hoặc số điện thoại.

  // Cảm ơn bạn!`,
  //   };

  //   const recipients = [
  //     { email: 'huynhthg@gmail.com', status: '✓', time: '09/06/2025, 08:27:00' },
  //     { email: 'nguyenhu@gmail.com', status: '✓', time: '09/06/2025, 08:28:00' },
  //     { email: 'dinhvan@gmail.com', status: '✓', time: '09/06/2025, 08:28:30' },
  //     { email: 'daothid@gmail.com', status: '✓', time: '09/06/2025, 08:29:00' },
  //     { email: 'levanc@gmail.com', status: '✓', time: '09/06/2025, 08:29:30' },
  //     { email: 'nguyenvana@gmail.com', status: '✓', time: '09/06/2025, 08:25:00' },
  //     { email: 'huynhvb@gmail.com', status: '✗', time: '09/06/2025, 08:24:00' },
  //   ];

  return (
    <div className="px-4">
      <div className="flex border border-gray-200 rounded-lg">
        <div className="flex flex-1 overflow-hidden">
          {/* Notification Details Section */}
          <div className="w-2/3 p-6 border-r border-gray-200">
            <NotificationDetails />
          </div>

          {/* Recipient List Section */}
          <div className="w-1/3 p-6">
            <RecipientList />
          </div>
        </div>
      </div>
      <div>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettingPage;
