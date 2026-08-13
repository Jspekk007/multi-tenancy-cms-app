import type { AuthContextResponse, JWTTokenPayload } from '@backend/modules/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTTokenPayload;
      tenantId?: string;
      tenantSlug?: string;
      authContext?: AuthContextResponse;
    }
  }
}

export {};
