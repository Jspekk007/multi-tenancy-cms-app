import { redisConfig } from '@backend/lib/redis.config';
import { sendMail } from '@backend/modules/mail/mail.service';
import { MailPayload } from '@backend/modules/mail/mail.types';
import { Job, Worker } from 'bullmq';

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
