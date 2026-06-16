import { customLogger } from '@backend/lib/logger';
import { redisConfig } from '@backend/lib/redis.config';
import { Queue } from 'bullmq';
export const EMAIL_QUEUE_NAME = 'mail-queue';
export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
    connection: redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 100 },
    },
});
export const addMailToQueue = async (payload) => {
    customLogger.info(`Adding email [${payload.template}] to queue for ${payload.to}`);
    await emailQueue.add(payload.template, payload);
};
//# sourceMappingURL=emailQueue.js.map