import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../tenant.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantService: TenantService,
    private readonly cls: ClsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // For auth routes, we'll allow the request to proceed without a tenant
    if (req.path.startsWith('/auth/')) {
      return next();
    }

    // First try to get tenant from custom header
    const tenantDomain = req.headers['x-tenant-domain'] as string;
    
    // If no custom header, try to get from host
    const host = req.get('host');
    const subdomain = host?.split('.')[0];

    // Use custom header if available, otherwise use subdomain
    const domain = tenantDomain || subdomain;

    try {
      const tenant = await this.tenantService.findByDomain(domain);
      if (!tenant) {
        throw new NotFoundException(`Tenant not found for domain: ${domain}`);
      }

      // Store tenant in request context
      this.cls.set('tenant', tenant);
      next();
    } catch (error) {
      next(error);
    }
  }
} 