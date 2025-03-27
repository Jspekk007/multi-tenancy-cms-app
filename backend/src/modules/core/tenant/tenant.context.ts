import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantContext {
  constructor(private readonly cls: ClsService) {}

  getTenant(): Tenant {
    return this.cls.get('tenant');
  }

  getTenantId(): string {
    return this.getTenant()?.id;
  }

  setTenant(tenant: Tenant): void {
    this.cls.set('tenant', tenant);
  }
} 