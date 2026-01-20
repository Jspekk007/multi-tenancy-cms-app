import '@backend/modules/mail/mail.worker';

import { customLogger } from '@backend/lib/logger';

customLogger.info('🚀 All workers initialized and listening to their respective queues.');
