import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TenantService } from '../tenant/tenant.service'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly tenantService: TenantService
  ) {}

  async createUser(
    email: string,
    password: string,
    tenantDomain?: string
  ): Promise<User> {
    const tenant = await this.tenantService.findTenantByDomain(tenantDomain)
    if (!tenant) throw new BadRequestException('Tenant not found')

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      tenant,
    })
    return this.userRepo.save(user)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { email } })
  }

  async findByUserId(id: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { id } })
  }
}
