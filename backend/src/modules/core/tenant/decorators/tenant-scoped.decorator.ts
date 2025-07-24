import { SetMetadata } from '@nestjs/common'

export const TENANT_SCOPED_KEY = 'tenantScoped'
export const TenantScoped = () => SetMetadata(TENANT_SCOPED_KEY, true)
