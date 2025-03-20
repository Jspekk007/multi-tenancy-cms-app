import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeedService } from './seed.service'
import { User } from '../core/user/user.entity'
import { Tenant } from '../core/tenant/tenant.entity'
import { Role } from '../core/auth/entities/role.entity'
import { UserRole } from '../core/auth/entities/user-role.entity'
import { AuthModule } from '../core/auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, Role, UserRole]),
    AuthModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
