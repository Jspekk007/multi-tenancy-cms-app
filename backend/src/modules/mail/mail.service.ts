import { config } from 'lib/config';
import { customLogger } from 'lib/logger';
import nodemailer, { Transporter } from 'nodemailer';

import { MailPayload } from './mail.types';
import { renderTemplate } from './mail.utils';

let transporter: Transporter | null = null;

const getTransporter = async (): Promise<Transporter> => {
  if (transporter) return transporter;

  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  customLogger.info(`Email transporter initialised. Preview URL: ${testAccount.web}`);
  return transporter;
};

export const sendMail = async (payload: MailPayload): Promise<void> => {
  const client = await getTransporter();

  const { html, text } = await renderTemplate(payload.template, payload.context);

  try {
    const info = await client.sendMail({
      from: process.env.MAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html,
      text,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    if (previewUrl) {
      customLogger.info(`🔗 Preview: ${previewUrl}`);
    }
  } catch (error) {
    customLogger.error(`❌ Failed to send email [${payload.template}]: ${String(error)}`);
    throw error;
  }
};
