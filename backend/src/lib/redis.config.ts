import { ConnectionOptions } from 'bullmq';

import { config } from './config';

export const redisConfig: ConnectionOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
};
