export interface IEmailService {
  sendOtpEmail(
    to: string,
    otp: string,
    amount: string,
    emailReceiver: string,
    userName: string,
  ): Promise<void>;

  sendNotificationEmail(
    to: string,
    variables: {
      userName: string;
      emailReceiver: string;
      date: string;
      amount: string;
    },
    isSendInBox?: boolean,
    sendInBoxProps?: {
      deepLink?: string;
      attachmentId?: string;
    },
  ): Promise<void>;
}
