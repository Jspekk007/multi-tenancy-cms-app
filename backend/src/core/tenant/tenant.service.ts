import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Tenant } from './tenant.entity'
import { Repository } from 'typeorm'
import { CreateTenantDto } from './create-tenant.dto'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {}

  async createTenant(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { name, domain } = createTenantDto

    // Check if tenant with domain already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { domain },
    })

    if (existingTenant) {
      throw new BadRequestException('Tenant already exists with this domain')
    }

    const tenant = this.tenantRepository.create({
      name,
      domain,
    })

    return this.tenantRepository.save(tenant)
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['users'],
    })

    if (!tenant) {
      throw new NotFoundException('Tenant not found')
    }

    return tenant
  }

  async findByDomain(domain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { domain },
      relations: ['users'],
    })

    if (!tenant) {
      throw new NotFoundException('Tenant not found')
    }

    return tenant
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      relations: ['users'],
    })
  }
}
