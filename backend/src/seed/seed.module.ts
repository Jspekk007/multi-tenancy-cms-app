import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeedService } from './seed.service'
import { User } from '../modules/core/user/user.entity'
import { Tenant } from '../modules/core/tenant/tenant.entity'
import { Role } from '../modules/core/auth/entities/role.entity'
import { UserRole } from '../modules/core/auth/entities/user-role.entity'
import { AuthModule } from '../modules/core/auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, Role, UserRole]),
    AuthModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
