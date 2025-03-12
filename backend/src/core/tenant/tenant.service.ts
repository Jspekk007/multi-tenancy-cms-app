import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Tenant } from './tenant.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>
  ) {}

  async createTenant(name: string, domain: string): Promise<Tenant> {
    const tenant = this.tenantRepo.create({ name, domain })
    return this.tenantRepo.save(tenant)
  }

  async findTenantByDomain(domain: string): Promise<Tenant | undefined> {
    return this.tenantRepo.findOne({ where: { domain } })
  }
}
