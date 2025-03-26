import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { TenantModule } from '../tenant/tenant.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { Role } from '../auth/entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), TenantModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
