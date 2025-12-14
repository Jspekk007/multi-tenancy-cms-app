import { SendMailOptions, Transporter } from 'nodemailer';

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  attachments?: SendMailOptions['attachments'];
}

export interface AppTransporter extends Transporter {}

export interface EtherealAccount {
  user: string;
  pass: string;
  web: string;
}

export interface SendEmailResult {
  messageId: string;
  previewUrl?: string;
}
