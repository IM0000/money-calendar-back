export interface EmailProvider {
  sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<any>;
}
