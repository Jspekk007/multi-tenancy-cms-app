import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { TenantService } from './modules/core/tenant/tenant.service'
import { JwtAuthGuard } from './modules/core/auth/guards/jwt-auth.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Content } from './modules/content/entities/content.entity'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tenantService: TenantService,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('debug/tenants')
  async debugTenants() {
    const tenants = await this.tenantService.getAllTenants()
    return {
      tenants,
      message: `Found ${tenants.length} tenants in database`
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('test/content')
  async createTestContent(@Body() content: { title: string; body: string }) {
    const newContent = this.contentRepository.create({
      title: content.title,
      body: content.body,
    })
    return this.contentRepository.save(newContent)
  }

  @UseGuards(JwtAuthGuard)
  @Get('test/content')
  async getTestContent() {
    return this.contentRepository.find()
  }
}
