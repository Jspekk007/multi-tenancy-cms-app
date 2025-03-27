import { Injectable, Scope } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  static readonly TENANT_ID_KEY = 'tenantId'

  constructor(private readonly cls: ClsService) {}

  get tenantId(): string | undefined {
    return this.cls.get(TenantContext.TENANT_ID_KEY)
  }

  set tenantId(tenantId: string | undefined) {
    this.cls.set(TenantContext.TENANT_ID_KEY, tenantId)
  }
}
