import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { TenantContext } from './tenant.context'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantContext: TenantContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(req)
    let tenantId: string | undefined

    const host = req.headers.host
    console.log(host)
    if (host) {
      const parts = host.split('.')
      if (parts.length > 2) {
        tenantId = parts[0]
      }
    }

    console.log(tenantId)

    if (!tenantId) {
      tenantId = req.headers['x-tenant-id'] as string | undefined
    }

    this.tenantContext.tenantId = tenantId

    next()
  }
}
