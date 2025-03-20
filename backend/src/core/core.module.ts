import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TenantModule } from './tenant/tenant.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [UserModule, TenantModule, AuthModule],
  exports: [UserModule, TenantModule, AuthModule],
})
export class CoreModule {}
