interface NotificationRecipientsCellProps {
  recipients: string | string[];
}

const NotificationRecipientsCell = ({ recipients }: NotificationRecipientsCellProps) => {
  if (Array.isArray(recipients)) {
    return <span>{recipients.length} emails</span>;
  }
  return <span>{recipients}</span>;
};

export default NotificationRecipientsCell;
