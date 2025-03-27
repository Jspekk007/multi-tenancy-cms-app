import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { TenantContext } from './modules/common/tenant/tenant.context'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tenantContext: TenantContext
  ) {}

  getHello(): string {
    return this.appService.getHello()
  }

  @Get()
  getTenantId(): string {
    return `TenantId: ${this.tenantContext.tenantId}`
  }
}
