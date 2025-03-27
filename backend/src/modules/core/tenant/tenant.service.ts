import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
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

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await this.tenantRepository.findOne({ where: { domain: dto.domain } })
    if (existingTenant) {
      throw new BadRequestException(`Tenant with domain ${dto.domain} already exists`)
    }

    const tenant = this.tenantRepository.create(dto)
    return this.tenantRepository.save(tenant)
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['users'],
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`)
    }

    return tenant
  }

  async findByDomain(domain: string): Promise<Tenant | null> {
    if (!domain) return null
    return this.tenantRepository.findOne({ where: { domain }, relations: ['users'] })
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      relations: ['users'],
    })
  }
}
