import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common'
import { TenantService } from './tenant.service'
import { CreateTenantDto } from './create-tenant.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @Roles('ADMIN')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(createTenantDto)
  }

  @Get()
  @Roles('ADMIN')
  async findAll() {
    return this.tenantService.getAllTenants()
  }

  @Get(':id')
  @Roles('ADMIN')
  async findById(@Param('id') id: string) {
    return this.tenantService.findById(id)
  }

  @Get('domain/:domain')
  @Roles('ADMIN')
  async findByDomain(@Param('domain') domain: string) {
    return this.tenantService.findByDomain(domain)
  }
}
