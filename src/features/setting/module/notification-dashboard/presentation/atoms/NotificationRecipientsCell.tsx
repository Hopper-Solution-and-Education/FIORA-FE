import NotificationRecipientsPopover from './NotificationRecipientsPopover';

interface NotificationRecipientsCellProps {
  recipients: string | string[];
}

const NotificationRecipientsCell = ({ recipients }: NotificationRecipientsCellProps) => {
  // Handle string email
  if (typeof recipients === 'string') {
    return (
      <NotificationRecipientsPopover recipients={[recipients]} showSearch={false}>
        <span
          className="block max-w-[150px] truncate underline underline-offset-2 cursor-pointer"
          title={recipients}
        >
          {recipients}
        </span>
      </NotificationRecipientsPopover>
    );
  }

  // Handle array of emails
  if (Array.isArray(recipients)) {
    if (recipients.length === 1) {
      // Single email - show with popover for full email display, no search needed
      return (
        <NotificationRecipientsPopover recipients={recipients} showSearch={false}>
          <span
            className="block max-w-[150px] truncate underline underline-offset-2 cursor-pointer"
            title={recipients[0]}
          >
            {recipients[0]}
          </span>
        </NotificationRecipientsPopover>
      );
    } else {
      // Multiple emails - show count with popover and search
      return (
        <NotificationRecipientsPopover recipients={recipients} showSearch={true}>
          <span className="block underline underline-offset-2 cursor-pointer max-w-[150px] truncate">
            {`${recipients.length} emails`}
          </span>
        </NotificationRecipientsPopover>
      );
    }
  }

  // Fallback
  return <span>No recipients</span>;
};

export default NotificationRecipientsCell;
