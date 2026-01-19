import type { JWTTokenPayload } from '@backend/modules/auth/auth.types';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: JWTTokenPayload | (User & { role?: string });
      tenantId?: string;
    }
  }
}

export {};
