export interface IEmailService {
  sendOtpEmail(
    to: string,
    otp: string,
    amount: string,
    emailReceiver: string,
    userName: string,
  ): Promise<string>;

  sendNotificationEmail(
    to: string,
    variables: {
      userName: string;
      emailReceiver: string;
      date: string;
      amount: string;
    },
  ): Promise<string>;
}
