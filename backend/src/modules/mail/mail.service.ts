import * as nodemailer from 'nodemailer';

import { customLogger } from '../../lib/logger';
import { getEmailTransporter, getEtherealAccount } from './mail.procedure';
import { EmailPayload, SendEmailResult } from './mail.types';
import { generateWelcomeEmailContent } from './mail.utils';

export class MailService {
  /**
   * Private method to handle the actual sending logic using the transporter.
   * @param {EmailPayload} payload - The email content and recipient details.
   * @returns {Promise<SendEmailResult>} The result containing the message ID and preview URL.
   */
  private async sendEmail(payload: EmailPayload): Promise<SendEmailResult> {
    const transporter = getEmailTransporter();
    const etherealAccount = getEtherealAccount();

    const fromAddress = payload.from || '"AtlasCMS" <no-reply@atlasCMS.com>';

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromAddress,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      attachments: payload.attachments,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      customLogger.info(`Email sent: ${info.messageId}`);

      const result: SendEmailResult = { messageId: info.messageId };
      if (etherealAccount) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        customLogger.info(`Preview URL: ${previewUrl}`);
        result.previewUrl = previewUrl || undefined;
      }

      return result;
    } catch (error) {
      customLogger.error(`Error sending email: ${String(error)}`);
      throw new Error('EMAIL_SEND_FAILURE: Failed to send email via transporter');
    }
  }

  /**
   * Public method exposed to other modules (like Auth).
   * Sends a welcome email to a newly signed-up user.
   * @param {string} toEmail - The recipient's email address.
   * @param {string} username - The user's display name.
   * @returns {Promise<SendEmailResult>} The result of the email operation.
   */
  public async sendWelcomeEmail(toEmail: string, username: string): Promise<SendEmailResult> {
    const content = generateWelcomeEmailContent(username);

    const payload: EmailPayload = {
      to: toEmail,
      subject: content.subject,
      html: content.html,
      text: content.text,
    };

    return this.sendEmail(payload);
  }
}
