import { NotificationFilterOptions } from '../dto/response/NotificationFilterOptionsResponse';

// Helper functions to convert API data to filter options
export const convertToFilterOptions = (apiData: NotificationFilterOptions) => {
  return {
    senderOptions: apiData.sender.map((sender) => ({ value: sender, label: sender })),
    recipientOptions: apiData.recipient.map((recipient) => ({
      value: recipient,
      label: recipient,
    })),
    notifyTypeOptions: apiData.notifyType.map((type) => ({ value: type, label: type })),
  };
};
