import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common'
import { TenantService } from './tenant.service'
import { CreateTenantDto } from './create-tenant.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { TenantContext } from './tenant.context'

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantController {
  private readonly logger = new Logger(TenantController.name)
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantContext: TenantContext
  ) {}

  @Post()
  @Roles('Admin')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(createTenantDto)
  }

  @Get()
  @Roles('Admin')
  async findAll() {
    return this.tenantService.getAllTenants()
  }

  @Get(':id')
  @Roles('Admin')
  async findById(@Param('id') id: string) {
    return this.tenantService.findById(id)
  }

  @Get('domain/:domain')
  @Roles('Admin')
  async findByDomain(@Param('domain') domain: string) {
    return this.tenantService.findByDomain(domain)
  }

  @Get('current')
  getCurrentTenant() {
    const tenant = this.tenantContext.getTenant()
    return {
      tenant,
      message: `Current tenant: ${tenant?.name || 'No tenant found'}`,
    }
  }
}
