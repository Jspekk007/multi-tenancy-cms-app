import { redisConfig } from '@backend/lib/redis.config';
import { sendMail } from '@backend/modules/mail/mail.service';
import { Worker } from 'bullmq';
export const mailWorker = new Worker('mail-queue', async (job) => {
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
}, { connection: redisConfig });
//# sourceMappingURL=mail.worker.js.map