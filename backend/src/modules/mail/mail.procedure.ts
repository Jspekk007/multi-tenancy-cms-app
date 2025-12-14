import * as nodemailer from 'nodemailer';

import { customLogger } from '../../lib/logger';
import { AppTransporter, EtherealAccount } from './mail.types';

let transporter: AppTransporter | null = null;
let etherealAccount: EtherealAccount | null = null;

export const initializeEmailTransporter = async (): Promise<void> => {
  if (transporter) {
    customLogger.info('Email transporter already initialised.');
    return;
  }

  const account = await nodemailer.createTestAccount();
  etherealAccount = account as EtherealAccount;

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: etherealAccount.user,
      pass: etherealAccount.pass,
    },
  }) as AppTransporter;

  customLogger.info(`Ethereal email transporter initialised. Preview URL: ${etherealAccount.web}`);
};

export const getEmailTransporter = (): AppTransporter => {
  if (!transporter) {
    throw new Error('Email transporter not initialised. Call initialiseEmailTransporter first.');
  }
  return transporter;
};

export const getEtherealAccount = (): EtherealAccount | null => {
  return etherealAccount;
};
