import { User } from '@prisma/client';

import type { JWTTokenPayload } from '../modules/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTTokenPayload | (User & { role?: string });
      tenantId?: string;
    }
  }
}

export {};
