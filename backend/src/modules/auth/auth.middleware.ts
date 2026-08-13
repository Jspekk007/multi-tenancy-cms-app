import { customLogger } from '@backend/lib/logger';
import { prismaClient } from '@backend/lib/prisma';
import type { AuthContextResponse, JWTTokenPayload } from '@backend/modules/auth/auth.types';
import { verifyToken } from '@backend/modules/auth/auth.utils';
import type { NextFunction, Request, Response } from 'express';

const PUBLIC_PATHS = [
  '/api/v1/auth.login',
  '/api/v1/auth.register',
  '/api/v1/auth.refresh',
  '/api/v1/auth.logout',
  '/api/v1/auth.passwordReset',
];

type AuthContextRow = {
  sessionId: string;
  sessionUserId: string;
  sessionTenantId: string;
  sessionExpiresAt: Date;
  sessionIsRevoked: boolean;
  userId: string;
  userEmail: string;
  userCreatedAt: Date;
  userUpdatedAt: Date;
  userIsActive: boolean;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  roleId: string;
};

export const authMiddleware = async (
  req: Request & { user?: JWTTokenPayload } & { headers: { authorization?: string } },
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  const pathWithoutQuery = req.originalUrl.split('?')[0];

  customLogger.debug({ path: pathWithoutQuery }, 'Auth middleware invoked');

  if (PUBLIC_PATHS.some((path) => pathWithoutQuery.startsWith(path))) {
    next();
    return undefined;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token) as JWTTokenPayload;
    if (!payload?.sessionId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const authRows: AuthContextRow[] = await prismaClient.$queryRaw<AuthContextRow[]>`
      SELECT
        s.id AS "sessionId",
        s."userId" AS "sessionUserId",
        s."tenantId" AS "sessionTenantId",
        s."expiresAt" AS "sessionExpiresAt",
        s."isRevoked" AS "sessionIsRevoked",
        u.id AS "userId",
        u.email AS "userEmail",
        u."createdAt" AS "userCreatedAt",
        u."updatedAt" AS "userUpdatedAt",
        u."isActive" AS "userIsActive",
        tu."tenantId" AS "tenantId",
        t.name AS "tenantName",
        t.slug AS "tenantSlug",
        tu."roleId" AS "roleId"
      FROM "Session" s
      INNER JOIN "User" u ON u.id = s."userId"
      INNER JOIN "TenantUser" tu ON tu."userId" = u.id
      INNER JOIN "Tenant" t ON t.id = tu."tenantId"
      WHERE s.id = ${payload.sessionId}
      ORDER BY t.name ASC
    `;

    const session = authRows[0];

    if (!session || session.sessionIsRevoked || session.sessionExpiresAt <= new Date()) {
      return res.status(401).json({ message: 'Session is not active' });
    }

    if (session.sessionUserId !== payload.userId) {
      return res.status(401).json({ message: 'Session user mismatch' });
    }

    if (session.sessionTenantId !== payload.tenantId) {
      return res.status(401).json({ message: 'Session tenant mismatch' });
    }

    if (!session.userIsActive) {
      return res.status(401).json({ message: 'User account is inactive' });
    }

    const activeTenant = authRows.find((tenant) => tenant.tenantId === payload.tenantId);

    if (!activeTenant) {
      return res.status(401).json({ message: 'User is not part of the tenant' });
    }

    if (req.tenantSlug && activeTenant.tenantSlug !== req.tenantSlug) {
      return res.status(403).json({ message: 'Session does not match this organization URL' });
    }

    const sites = await prismaClient.site.findMany({
      where: { tenantId: activeTenant.tenantId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    const authContext: AuthContextResponse = {
      user: {
        id: session.userId,
        email: session.userEmail,
        tenantId: activeTenant.tenantId,
        tenantName: activeTenant.tenantName,
        tenantSlug: activeTenant.tenantSlug,
        role: activeTenant.roleId,
        createdAt: session.userCreatedAt,
        updatedAt: session.userUpdatedAt,
      },
      tenants: authRows.map((tenant) => ({
        id: tenant.tenantId,
        name: tenant.tenantName,
        slug: tenant.tenantSlug,
        role: tenant.roleId,
      })),
      sites,
    };

    req.user = payload;
    req.tenantId = payload.tenantId;
    req.authContext = authContext;

    next();
    return;
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
