import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { TenantService } from './tenant.service'
import { CreateTenantDto } from './create-tenant.dto'

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(
      createTenantDto.name,
      createTenantDto.domain
    )
  }
}
