import { Job, Worker } from 'bullmq';
import { redisConfig } from 'lib/redis.config';

import { sendMail } from './mail.service';
import { MailPayload } from './mail.types';

export const mailWorker = new Worker<MailPayload>(
  'mail-queue',
  async (job: Job<MailPayload>) => {
    switch (job.name) {
      case 'password-reset':
        await sendMail(job.data);
        break;

      case 'welcome-email':
        await sendMail(job.data);
        break;

      default:
        console.warn(`No handler for email template: ${job.name}`);
    }
  },
  { connection: redisConfig },
);
