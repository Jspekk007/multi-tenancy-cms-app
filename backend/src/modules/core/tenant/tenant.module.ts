import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'
import { Tenant } from './tenant.entity'
import { TenantContext } from './tenant.context'
import { TenantInterceptor } from './interceptors/tenant.interceptor'

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [
    TenantService,
    TenantContext,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  exports: [TenantService, TenantContext],
})
export class TenantModule {}
