'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { ChannelType, NotificationStatus, type INotificationDetails } from '../../domain/entity';

const ATTACHMENT_TYPES = {
  WEBP: 'WEBP',
  IMAGE: 'IMAGE',
  QR: 'QR',
  ICON: 'ICON',
  PDF: 'PDF',
};

export function NotificationDetails({
  data,
  emailSelected,
}: {
  data: INotificationDetails;
  emailSelected: string;
}) {
  const renderAttachment = () => {
    switch (data?.attachment?.type) {
      case ATTACHMENT_TYPES.IMAGE:
      case ATTACHMENT_TYPES.WEBP:
      case ATTACHMENT_TYPES.QR:
        return <Image src={data?.attachment?.url} alt="attachment" width={100} height={100} />;

      default:
        return <div>Attachment</div>;
    }
  };
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-2">Notification Details</h2>

      <div className="text-gray-600 mb-2 text-sm">
        Show details for: <span className="font-bold">{emailSelected}</span>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-10">
        <div>
          <b>Title</b>
          <p className="text-sm ">{data?.title}</p>
        </div>
        <div>
          <b>Sender</b>
          <p className="text-sm">{data?.sender}</p>
        </div>
        <div>
          <b>Notify Type</b>
          <p className="text-sm">{data?.notifyType}</p>
        </div>
        <div>
          <b>Channel</b>
          <div className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 max-w-20 text-center">
            {data?.channel}
          </div>
        </div>
        <div>
          <b>Received At</b>
          <p className="text-sm">{format(data?.sendDate, 'dd/MM/yyyy HH:mm:ss')}</p>
        </div>
        <div>
          <b>Send Status</b>
          {data?.status === NotificationStatus.SENT ? (
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 max-w-20 text-center">
              Success
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 max-w-20 text-center">
              Failed
            </div>
          )}
        </div>

        {data.channel === ChannelType.BOX && (
          <>
            <div>
              <b>Attachment</b>
              <div>{renderAttachment()}</div>
            </div>

            <div>
              <div className="font-bold">Deep Link</div>
              <Link
                href={data?.deepLink || ''}
                target="_blank"
                className="text-sm text-blue-500 hover:underline"
              >
                {data?.deepLink || ''}
              </Link>
            </div>
          </>
        )}
        {data?.status !== NotificationStatus.SENT && (
          <div>
            <b>Error Message</b>
            <p className="text-sm text-red-500">{data?.message}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Content</h3>
        <ScrollArea className=" w-full rounded-md border p-4 bg-gray-50">
          <div dangerouslySetInnerHTML={{ __html: data?.subject || '' }} />
        </ScrollArea>
      </div>
    </div>
  );
}
