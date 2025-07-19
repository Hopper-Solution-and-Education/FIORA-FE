// src/components/notification-details.tsx
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationDetails() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-2">Notification Details</h2>

      <div className="text-gray-600 mb-2 text-sm">
        Show details for: <span className="font-medium text-blue-600">nguyenvanana@gmail.com</span>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-10">
        <div>
          <b>Title</b>
          <p className="text-sm ">Hướng dẫn hoàn tất quy trình KYC trên hệ thống FIORA</p>
        </div>
        <div>
          <b>Sender</b>
          <p className="text-sm">admin@fiora.com</p>
        </div>
        <div>
          <b>Notify Type</b>
          <p className="text-sm text-green-600">Support</p>
        </div>
        <div>
          <b>Channel</b>
          <p className="text-sm text-blue-600">Email</p>
        </div>
        <div>
          <b>Received At</b>
          <p className="text-sm">09/06/2025, 08:25:00</p>
        </div>
        <div>
          <b>Send Status</b>
          <div className="items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 max-w-20">
            Success
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Content</h3>
        <ScrollArea className=" w-full rounded-md border p-4 bg-gray-50">
          <p className="mb-2">Kính gửi {'{name}'},</p>
          <p className="mb-2">Chúng tôi hy vọng bạn vẫn khỏe.</p>
          <p className="mb-2">
            Để hoàn tất việc kích hoạt tài khoản của bạn trên hệ thống FIORA và đảm bảo tuân thủ các
            quy định tài chính, chúng tôi cần bạn hoàn tất quy trình{' '}
            <span className="font-semibold">Xác minh danh tính khách hàng (KYC)</span>.
          </p>
          <p className="mb-2">
            Quy trình KYC là bước quan trọng giúp chúng tôi bảo vệ tài khoản của bạn và ngăn chặn
            các hoạt động gian lận. Việc này chỉ mất vài phút để hoàn thành.
          </p>
          <p className="font-semibold text-lg mb-2">
            Vui lòng làm theo các bước đơn giản sau để hoàn tất KYC:
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              <span className="font-semibold">Đăng nhập vào tài khoản FIORA của bạn:</span> Truy cập{' '}
              <a
                href="https://fiora-dev.vercel.app/auth/sign-in"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://fiora-dev.vercel.app/auth/sign-in
              </a>{' '}
              và đăng nhập bằng thông tin đăng nhập của bạn.
            </li>
            <li>
              <span className="font-semibold">Truy cập phần KYC:</span> Sau khi đăng nhập, tìm và
              nhấp vào mục &quot;Xác minh danh tính&quot; hoặc &quot;KYC&quot; trên bảng điều khiển
              hoặc menu tài khoản của bạn.
            </li>
            <li>
              <span className="font-semibold">Cung cấp thông tin yêu cầu:</span> Bạn sẽ được yêu cầu
              cung cấp một số thông tin cá nhân và tải lên các tài liệu cần thiết (ví dụ: bản sao
              CMND/CCC...).
            </li>
          </ol>
        </ScrollArea>
      </div>
    </div>
  );
}
