import type { NextFunction, Request, Response } from 'express';

import { getTenantSlugFromRequest } from './tenant-host.utils';

export const tenantHostMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  req.tenantSlug = getTenantSlugFromRequest(req);
  next();
};
