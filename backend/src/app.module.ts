import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoreModule } from './core/core.module'
import { UserRole } from './core/auth/entities/user-role.entity'
import { User } from './core/user/user.entity'
import { Role } from './core/auth/entities/role.entity'
import { Tenant } from './core/tenant/tenant.entity'
import { SeedModule } from './seed/seed.module'
import typeOrmConfig from './config/database.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    CoreModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
