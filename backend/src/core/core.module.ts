import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TenantModule } from './tenant/tenant.module'

@Module({
  imports: [UserModule, TenantModule],
  exports: [UserModule, TenantModule],
})
export class CoreModule {}
